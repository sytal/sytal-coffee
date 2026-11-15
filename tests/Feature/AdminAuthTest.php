<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_login(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect('/login');
    }

    public function test_staff_role_cannot_access_admin_area(): void
    {
        $staff = User::factory()->create(['role' => User::ROLE_STAFF]);

        $response = $this->actingAs($staff)->get('/admin');

        $response->assertStatus(403);
    }

    public function test_admin_role_can_access_admin_area(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $response = $this->actingAs($admin)->get('/admin');

        $response->assertStatus(200);
    }

    public function test_manager_role_can_access_admin_area(): void
    {
        $manager = User::factory()->create(['role' => User::ROLE_MANAGER]);

        $response = $this->actingAs($manager)->get('/admin');

        $response->assertStatus(200);
    }

    public function test_login_rejects_wrong_credentials(): void
    {
        User::factory()->create(['email' => 'admin@kavo.sytal.io']);

        $response = $this->post('/login', [
            'email' => 'admin@kavo.sytal.io',
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_login_succeeds_with_correct_credentials(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@kavo.sytal.io',
            'password' => bcrypt('correct-password'),
            'role' => User::ROLE_ADMIN,
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@kavo.sytal.io',
            'password' => 'correct-password',
        ]);

        $response->assertRedirect('/admin');
        $this->assertAuthenticatedAs($admin);
    }

    public function test_logout_ends_the_session(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $response = $this->actingAs($admin)->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_public_site_is_not_protected(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
