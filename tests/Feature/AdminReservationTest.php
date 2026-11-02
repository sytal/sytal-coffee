<?php

namespace Tests\Feature;

use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminReservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withAdminAuth();
    }

    public function test_admin_can_confirm_a_reservation(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'Pending']);

        $response = $this->patch("/admin/reservations/{$reservation->id}/status", ['status' => 'Confirmed']);

        $response->assertRedirect();
        $this->assertDatabaseHas('reservations', ['id' => $reservation->id, 'status' => 'Confirmed']);
    }

    public function test_admin_can_cancel_a_reservation(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'Pending']);

        $response = $this->patch("/admin/reservations/{$reservation->id}/status", ['status' => 'Cancelled']);

        $response->assertRedirect();
        $this->assertDatabaseHas('reservations', ['id' => $reservation->id, 'status' => 'Cancelled']);
    }

    public function test_reservation_status_rejects_invalid_value(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'Pending']);

        $response = $this->patch("/admin/reservations/{$reservation->id}/status", ['status' => 'NotARealStatus']);

        $response->assertSessionHasErrors('status');
        $this->assertDatabaseHas('reservations', ['id' => $reservation->id, 'status' => 'Pending']);
    }
}
