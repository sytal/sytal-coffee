<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create an order + its line items in one transaction. Prices are looked
     * up server-side from the current menu items — never trusting a price
     * the client might send — so the total can't be tampered with.
     */
    public function create(User $user, array $data): Order
    {
        return DB::transaction(function () use ($user, $data) {
            $order = Order::create([
                'user_id' => $user->id,
                'delivery_address' => $data['delivery_address'],
                'phone' => $data['phone'],
                'notes' => $data['notes'] ?? null,
                'status' => Order::STATUS_PENDING,
                'total' => 0,
            ]);

            $menuItems = MenuItem::query()
                ->whereIn('id', collect($data['items'])->pluck('menu_item_id'))
                ->get()
                ->keyBy('id');

            $total = 0;

            foreach ($data['items'] as $line) {
                $menuItem = $menuItems->get($line['menu_item_id']);
                if (! $menuItem || ! $menuItem->is_available) {
                    continue;
                }

                $unitPrice = $menuItem->numericPrice();
                $quantity = (int) $line['quantity'];

                $order->items()->create([
                    'menu_item_id' => $menuItem->id,
                    'name' => $menuItem->name,
                    'price' => $unitPrice,
                    'quantity' => $quantity,
                ]);

                $total += $unitPrice * $quantity;
            }

            $fee = app(BusinessSettingsService::class)->deliveryFee();

            $order->update([
                'subtotal' => $total,
                'delivery_fee' => $fee,
                'payment_method' => 'Cash on Delivery',
                'total' => $total + $fee,
            ]);

            return $order->fresh('items');
        });
    }

    public function forUser(User $user): Collection
    {
        return Order::query()
            ->where('user_id', $user->id)
            ->with('items')
            ->latest()
            ->get();
    }

    public function all(): Collection
    {
        return Order::query()
            ->with(['items', 'user:id,name,email'])
            ->latest()
            ->get();
    }

    public function updateStatus(Order $order, string $status): Order
    {
        $order->update(['status' => $status]);

        return $order;
    }

    /**
     * Cheap "anything new since X?" check for the admin polling UI. $since
     * is either the last order id the client saw (numeric) or an ISO
     * timestamp string; either way this stays a COUNT + MAX query, never
     * loading the order rows themselves.
     */
    public function latestCheck(?string $since): array
    {
        $latest = Order::query()->latest('id')->first(['id', 'created_at']);

        $newCount = 0;

        if ($since !== null && $since !== '') {
            $newCount = Order::query()
                ->when(
                    is_numeric($since),
                    fn ($query) => $query->where('id', '>', (int) $since),
                    fn ($query) => $query->where('created_at', '>', $since)
                )
                ->count();
        }

        return [
            'new_count' => $newCount,
            'latest_order_id' => $latest?->id,
            'latest_created_at' => $latest?->created_at,
        ];
    }
}
