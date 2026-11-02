<?php

namespace Tests\Feature;

use App\Models\ContactMessage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminMessageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withAdminAuth();
    }

    public function test_admin_can_mark_a_message_read(): void
    {
        $message = ContactMessage::factory()->create(['status' => 'New']);

        $response = $this->patch("/admin/messages/{$message->id}/read");

        $response->assertRedirect();
        $this->assertDatabaseHas('contact_messages', ['id' => $message->id, 'status' => 'Read']);
    }

    public function test_admin_can_delete_a_message(): void
    {
        $message = ContactMessage::factory()->create();

        $response = $this->delete("/admin/messages/{$message->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('contact_messages', ['id' => $message->id]);
    }
}
