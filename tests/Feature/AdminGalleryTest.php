<?php

namespace Tests\Feature;

use App\Models\GalleryImage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminGalleryTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withAdminAuth();
    }

    public function test_admin_can_upload_a_gallery_image(): void
    {
        Storage::fake('public');

        $response = $this->post('/admin/gallery', [
            'label' => 'New Terrace Shot',
            'image' => UploadedFile::fake()->image('terrace.jpg'),
        ]);

        $response->assertRedirect();
        $image = GalleryImage::where('label', 'New Terrace Shot')->firstOrFail();
        Storage::disk('public')->assertExists(str_replace('/storage/', '', $image->image));
    }

    public function test_admin_can_delete_a_gallery_image(): void
    {
        $image = GalleryImage::factory()->create();

        $response = $this->delete("/admin/gallery/{$image->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('gallery_images', ['id' => $image->id]);
    }
}
