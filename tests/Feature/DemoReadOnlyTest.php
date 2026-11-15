<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DemoUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoReadOnlyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['demo.enabled' => true]);
        $this->seed(DemoUserSeeder::class);
    }

    public function test_demo_admin_can_view_admin_pages(): void
    {
        $demo = User::where('email', config('demo.admin.email'))->first();

        $this->actingAs($demo)->get('/admin')->assertOk();
        $this->actingAs($demo)->get('/admin/menu')->assertOk();
    }

    public function test_demo_admin_cannot_change_anything(): void
    {
        $demo = User::where('email', config('demo.admin.email'))->first();

        $this->actingAs($demo)->putJson('/admin/business', [])->assertForbidden();
        $this->actingAs($demo)->from('/admin/menu')->post('/admin/categories', ['name' => 'X'])
            ->assertRedirect('/admin/menu')
            ->assertSessionHas('error');
    }

    public function test_real_admin_is_not_restricted(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->post('/admin/categories', ['name' => 'Desserts'])
            ->assertSessionMissing('error');
    }

    public function test_seeder_skips_when_demo_mode_is_off(): void
    {
        User::query()->delete();
        config(['demo.enabled' => false]);
        $this->seed(DemoUserSeeder::class);

        $this->assertSame(0, User::count());
    }

    public function test_demo_data_seeder_is_rerunnable(): void
    {
        $this->seed([\Database\Seeders\MenuItemSeeder::class, \Database\Seeders\DemoDataSeeder::class]);
        $this->seed(\Database\Seeders\DemoDataSeeder::class);

        $this->assertSame(10, \App\Models\Order::count());
        $this->assertSame(5, \App\Models\Reservation::count());
        $this->assertSame(3, \App\Models\ContactMessage::count());
        $this->assertGreaterThan(0, (float) \App\Models\Order::first()->total);
    }
}
