<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrderLatestCheckTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withAdminAuth();
    }

    private function makeOrder(): Order
    {
        return Order::create([
            'user_id' => User::factory()->create()->id,
            'delivery_address' => '123 Test St',
            'phone' => '555-0100',
            'status' => Order::STATUS_PENDING,
            'total' => 10,
        ]);
    }

    public function test_guests_cannot_hit_the_polling_endpoint(): void
    {
        auth()->logout();

        $response = $this->get('/admin/orders/latest-check');

        $response->assertRedirect('/login');
    }

    public function test_reports_no_new_orders_when_nothing_changed(): void
    {
        $order = $this->makeOrder();

        $response = $this->getJson("/admin/orders/latest-check?since={$order->id}");

        $response->assertOk();
        $response->assertJson([
            'new_count' => 0,
            'latest_order_id' => $order->id,
        ]);
    }

    public function test_reports_new_orders_created_after_the_marker(): void
    {
        $first = $this->makeOrder();
        $second = $this->makeOrder();

        $response = $this->getJson("/admin/orders/latest-check?since={$first->id}");

        $response->assertOk();
        $response->assertJson([
            'new_count' => 1,
            'latest_order_id' => $second->id,
        ]);
    }
}
