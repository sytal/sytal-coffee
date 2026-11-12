<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class AdminMenuItemTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withAdminAuth();
    }

    public function test_admin_can_create_a_menu_item(): void
    {
        $response = $this->post('/admin/menu', [
            'name' => 'Test Burger',
            'category' => 'Burgers',
            'description' => 'A test burger for the test suite.',
            'price' => 'Rs. 500',
            'tags' => ['Test', 'Burger'],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('menu_items', ['name' => 'Test Burger', 'category' => 'Burgers']);
    }

    public function test_admin_can_create_a_menu_item_with_an_uploaded_image(): void
    {
        \Illuminate\Support\Facades\Storage::fake('uploads');

        $response = $this->post('/admin/menu', [
            'name' => 'Image Burger',
            'category' => 'Burgers',
            'description' => 'Has a real uploaded image.',
            'price' => 'Rs. 600',
            'image' => UploadedFile::fake()->image('burger.jpg'),
        ]);

        $response->assertRedirect();
        $item = MenuItem::where('name', 'Image Burger')->firstOrFail();
        $this->assertNotNull($item->image);
        \Illuminate\Support\Facades\Storage::disk('uploads')->assertExists(str_replace('/uploads/', '', $item->image));
    }

    public function test_admin_can_update_a_menu_item(): void
    {
        $item = MenuItem::factory()->create(['name' => 'Old Name', 'category' => 'Desserts']);

        $response = $this->put("/admin/menu/{$item->id}", [
            'name' => 'New Name',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('menu_items', ['id' => $item->id, 'name' => 'New Name']);
    }

    public function test_admin_can_delete_a_menu_item(): void
    {
        $item = MenuItem::factory()->create();

        $response = $this->delete("/admin/menu/{$item->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('menu_items', ['id' => $item->id]);
    }

    public function test_menu_item_requires_valid_fields(): void
    {
        $response = $this->post('/admin/menu', ['name' => '', 'category' => '', 'description' => '', 'price' => '']);

        $response->assertSessionHasErrors(['name', 'category', 'description', 'price']);
    }
}
