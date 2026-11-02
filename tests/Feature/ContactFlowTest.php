<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_website_visitor_can_send_a_contact_message(): void
    {
        $response = $this->post('/contact', [
            'name' => 'Sara Ahmed',
            'email' => 'sara@example.com',
            'phone' => '0300-9988776',
            'message' => 'Do you deliver outside Faisalabad?',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'sara@example.com',
            'status' => 'New',
        ]);
    }

    public function test_website_visitor_can_subscribe_to_the_newsletter(): void
    {
        $response = $this->post('/newsletter', ['email' => 'fan@example.com']);

        $response->assertRedirect();
        $this->assertDatabaseHas('newsletter_subscribers', ['email' => 'fan@example.com']);
    }

    public function test_newsletter_subscribe_is_idempotent_for_same_email(): void
    {
        $this->post('/newsletter', ['email' => 'dup@example.com']);
        $this->post('/newsletter', ['email' => 'dup@example.com']);

        $this->assertDatabaseCount('newsletter_subscribers', 1);
    }

    public function test_contact_message_requires_valid_fields(): void
    {
        $response = $this->post('/contact', ['name' => '', 'email' => 'bad', 'phone' => '', 'message' => '']);

        $response->assertSessionHasErrors(['name', 'email', 'phone', 'message']);
    }
}
