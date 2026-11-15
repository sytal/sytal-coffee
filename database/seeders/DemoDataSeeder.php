<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Realistic sample orders, bookings and messages so the demo admin has
 * something to look at. Runs only when DEMO_MODE=true and is safe to re-run:
 * it replaces its own records (all tied to @example.com addresses) and
 * re-dates them around "today", so it can be scheduled daily on a demo host.
 */
class DemoDataSeeder extends Seeder
{
    private const CUSTOMERS = [
        ['Ayesha Khan', 'ayesha.khan@example.com', '03211234567', 'House 14, Block C, Madina Town'],
        ['Hamza Iqbal', 'hamza.iqbal@example.com', '03007654321', 'Flat 3, Kohinoor City'],
        ['Fatima Noor', 'fatima.noor@example.com', '03331239876', '22-B Peoples Colony No. 1'],
        ['Bilal Ahmed', 'bilal.ahmed@example.com', '03451112233', 'Street 5, Gulberg Road'],
        ['Zainab Ali', 'zainab.ali@example.com', '03124445566', '7 Canal Road, Officers Colony'],
    ];

    public function run(): void
    {
        if (! config('demo.enabled')) {
            $this->command?->warn('DEMO_MODE is off — skipping demo data.');

            return;
        }

        $menu = MenuItem::query()->orderBy('id')->get();
        if ($menu->isEmpty()) {
            $this->command?->warn('No menu items — run the menu seeders first.');

            return;
        }

        DB::transaction(function () use ($menu): void {
            $this->clearPrevious();
            $customers = $this->customers();
            $this->orders($customers, $menu);
            $this->reservations();
            $this->messages();
        });
    }

    private function clearPrevious(): void
    {
        $ids = User::query()->where('email', 'like', '%@example.com')
            ->orWhere('email', config('demo.customer.email'))->pluck('id');
        Order::query()->whereIn('user_id', $ids)->each(function (Order $order): void {
            $order->items()->delete();
            $order->delete();
        });
        Reservation::query()->where('email', 'like', '%@example.com')->delete();
        ContactMessage::query()->where('email', 'like', '%@example.com')->delete();
    }

    /** @return array<int, array{user: User, address: string}> */
    private function customers(): array
    {
        $list = [];
        foreach (self::CUSTOMERS as [$name, $email, $phone, $address]) {
            $user = User::query()->firstOrCreate(['email' => $email], [
                'name' => $name,
                'phone' => $phone,
                'password' => Hash::make(Str::random(32)),
                'role' => User::ROLE_CUSTOMER,
            ]);
            $list[] = ['user' => $user, 'address' => $address];
        }

        $demo = User::query()->where('email', config('demo.customer.email'))->first();
        if ($demo) {
            $list[] = ['user' => $demo, 'address' => 'House 9, Susan Road, Faisalabad'];
        }

        return $list;
    }

    private function orders(array $customers, $menu): void
    {
        // [customer index, minutes ago, status, [menu index => qty], note]
        $plan = [
            [0, 6, Order::STATUS_PENDING, [0 => 1, 4 => 2], 'Extra ketchup please'],
            [1, 18, Order::STATUS_PREPARING, [5 => 1, 1 => 1], null],
            [2, 35, Order::STATUS_OUT_FOR_DELIVERY, [8 => 2, 2 => 1], 'Call on arrival'],
            [3, 70, Order::STATUS_COMPLETED, [6 => 2, 3 => 2], null],
            [4, 140, Order::STATUS_COMPLETED, [12 => 1, 9 => 2], null],
            [5, 60 * 26, Order::STATUS_COMPLETED, [0 => 1, 10 => 1], null],
            [1, 60 * 30, Order::STATUS_CANCELLED, [7 => 1], 'Ordered by mistake'],
            [0, 60 * 50, Order::STATUS_COMPLETED, [4 => 1, 13 => 2], null],
            // The public demo customer (index 5) gets a live order plus history.
            [5, 12, Order::STATUS_PREPARING, [6 => 1, 11 => 2], 'Less spicy please'],
            [5, 60 * 72, Order::STATUS_COMPLETED, [2 => 1, 14 => 1], null],
        ];

        foreach ($plan as [$c, $ago, $status, $lines, $note]) {
            $customer = $customers[$c % count($customers)];
            $at = Carbon::now()->subMinutes($ago);
            $items = collect($lines)->map(fn ($qty, $i) => [$menu[$i % $menu->count()], $qty]);
            $subtotal = $items->sum(fn ($l) => $l[0]->numericPrice() * $l[1]);

            $order = new Order([
                'user_id' => $customer['user']->id,
                'delivery_address' => $customer['address'],
                'phone' => $customer['user']->phone,
                'notes' => $note,
                'status' => $status,
                'subtotal' => $subtotal,
                'delivery_fee' => 0,
                'payment_method' => 'Cash on Delivery',
                'total' => $subtotal,
            ]);
            $order->created_at = $order->updated_at = $at;
            $order->save();

            foreach ($items as [$item, $qty]) {
                $order->items()->create([
                    'menu_item_id' => $item->id,
                    'name' => $item->name,
                    'price' => $item->numericPrice(),
                    'quantity' => $qty,
                ]);
            }
        }
    }

    private function reservations(): void
    {
        $rows = [
            ['Hamza Iqbal', 0, '20:00', 4, 'Pending', 'Birthday — a candle on the dessert would be great'],
            ['Ayesha Khan', 0, '19:30', 2, 'Confirmed', null],
            ['Bilal Ahmed', 1, '21:00', 6, 'Pending', 'Need a table near the window'],
            ['Fatima Noor', 2, '18:30', 3, 'Confirmed', 'One high chair please'],
            ['Zainab Ali', 3, '20:30', 8, 'Pending', 'Office dinner'],
        ];
        foreach ($rows as [$name, $inDays, $time, $size, $status, $requests]) {
            Reservation::query()->create([
                'name' => $name,
                'email' => Str::slug($name, '.').'@example.com',
                'phone' => '0300'.random_int(1000000, 9999999),
                'date' => Carbon::today()->addDays($inDays)->toDateString(),
                'time' => $time,
                'party_size' => $size,
                'requests' => $requests,
                'status' => $status,
            ]);
        }
    }

    private function messages(): void
    {
        $rows = [
            ['Usman Tariq', 'Do you cater for office events? We need food for about 40 people next Friday.', 'New', 25],
            ['Sana Malik', 'Loved the Peri Peri Fries! Are you planning a branch in D Ground?', 'New', 90],
            ['Ali Raza', 'Is there a student discount on weekdays?', 'Read', 60 * 20],
        ];
        foreach ($rows as [$name, $text, $status, $ago]) {
            $msg = new ContactMessage([
                'name' => $name,
                'email' => Str::slug($name, '.').'@example.com',
                'phone' => '0312'.random_int(1000000, 9999999),
                'message' => $text,
                'status' => $status,
            ]);
            $msg->created_at = $msg->updated_at = Carbon::now()->subMinutes($ago);
            $msg->save();
        }
    }
}
