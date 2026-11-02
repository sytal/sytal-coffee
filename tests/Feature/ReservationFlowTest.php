<?php

namespace Tests\Feature;

use App\Models\Reservation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReservationFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_website_visitor_can_submit_a_reservation(): void
    {
        $response = $this->post('/reservations', [
            'name' => 'Ahmed Raza',
            'email' => 'ahmed@example.com',
            'phone' => '0300-1234567',
            'date' => now()->addDay()->toDateString(),
            'time' => '19:30',
            'party_size' => 4,
            'requests' => 'Window seat please',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('reservations', [
            'email' => 'ahmed@example.com',
            'status' => 'Pending',
        ]);
    }

    public function test_reservation_requires_valid_fields(): void
    {
        $response = $this->post('/reservations', [
            'name' => '',
            'email' => 'not-an-email',
            'phone' => '',
            'date' => now()->subDay()->toDateString(), // past date, should fail
            'time' => '',
            'party_size' => 0,
        ]);

        $response->assertSessionHasErrors(['name', 'email', 'phone', 'date', 'time', 'party_size']);
        $this->assertDatabaseCount('reservations', 0);
    }
}
