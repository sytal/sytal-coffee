<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use App\Models\GalleryImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiV1Test extends TestCase
{
    use RefreshDatabase;

    public function test_menu_items_endpoint_returns_seeded_data(): void
    {
        MenuItem::factory()->count(3)->create(['category' => 'Burgers']);

        $response = $this->getJson('/api/v1/menu-items');

        $response->assertOk();
        $response->assertJsonCount(3, 'data');
        $response->assertJsonStructure(['data' => [['id', 'name', 'category', 'description', 'price', 'image', 'tags']]]);
    }

    public function test_menu_items_can_be_filtered_by_category(): void
    {
        MenuItem::factory()->create(['category' => 'Burgers', 'name' => 'Burger A']);
        MenuItem::factory()->create(['category' => 'Desserts', 'name' => 'Dessert A']);

        $response = $this->getJson('/api/v1/menu-items?category=Burgers');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment(['name' => 'Burger A']);
    }

    public function test_menu_categories_endpoint(): void
    {
        MenuItem::factory()->create(['category' => 'Burgers']);

        $response = $this->getJson('/api/v1/menu-categories');

        $response->assertOk();
    }

    public function test_gallery_endpoint(): void
    {
        GalleryImage::factory()->count(2)->create();

        $response = $this->getJson('/api/v1/gallery');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    public function test_api_can_create_a_reservation(): void
    {
        $response = $this->postJson('/api/v1/reservations', [
            'name' => 'App User',
            'email' => 'appuser@example.com',
            'phone' => '0300-1112223',
            'date' => now()->addDay()->toDateString(),
            'time' => '20:00',
            'party_size' => 2,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('reservations', ['email' => 'appuser@example.com']);
    }

    public function test_api_can_create_a_contact_message(): void
    {
        $response = $this->postJson('/api/v1/contact-messages', [
            'name' => 'App User',
            'email' => 'appuser2@example.com',
            'phone' => '0300-1112224',
            'message' => 'Hello from the app',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('contact_messages', ['email' => 'appuser2@example.com']);
    }

    public function test_api_can_subscribe_to_newsletter(): void
    {
        $response = $this->postJson('/api/v1/newsletter', ['email' => 'appnews@example.com']);

        $response->assertCreated();
        $this->assertDatabaseHas('newsletter_subscribers', ['email' => 'appnews@example.com']);
    }

    public function test_api_newsletter_rejects_invalid_email(): void
    {
        $response = $this->postJson('/api/v1/newsletter', ['email' => 'not-an-email']);

        $response->assertStatus(422);
    }
}
