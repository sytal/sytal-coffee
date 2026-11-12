<?php

namespace Tests\Feature;

use App\Models\ContentBlock;
use App\Models\GalleryImage;
use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\MenuTag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/**
 * Regression tests for the bugs found in the Nov 2026 QA pass.
 */
class QaRegressionTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_menu_page_fills_categories_and_tags_from_existing_items(): void
    {
        MenuItem::factory()->create(['category' => 'Loaded Fries', 'tags' => ['Spicy']]);
        MenuItem::factory()->create(['category' => 'Burgers', 'tags' => ['BBQ']]);

        $this->withAdminAuth()->get('/admin/menu')->assertOk();

        $this->assertEqualsCanonicalizing(['Loaded Fries', 'Burgers'], MenuCategory::pluck('name')->all());
        $this->assertEqualsCanonicalizing(['Spicy', 'BBQ'], MenuTag::pluck('name')->all());
    }

    public function test_menu_item_price_is_validated_and_normalised(): void
    {
        $this->withAdminAuth();
        $base = ['name' => 'QA Fries', 'category' => 'Loaded Fries', 'description' => 'Test'];

        $this->post('/admin/menu', $base + ['price' => 'abc'])->assertSessionHasErrors('price');

        $this->post('/admin/menu', $base + ['price' => '999', 'tags' => ['Brand New Tag']])->assertSessionHasNoErrors();
        $this->assertDatabaseHas('menu_items', ['name' => 'QA Fries', 'price' => 'Rs. 999']);
        $this->assertDatabaseHas('menu_tags', ['name' => 'Brand New Tag']);
        $this->assertDatabaseHas('menu_categories', ['name' => 'Loaded Fries']);
    }

    public function test_content_text_edits_sent_as_json_are_saved(): void
    {
        $this->withAdminAuth()
            ->post('/admin/content/about', ['fields' => json_encode(['eyebrow' => 'QA eyebrow'])])
            ->assertSessionHasNoErrors();

        $this->assertSame('QA eyebrow', ContentBlock::where('section_key', 'about')->first()->fields['eyebrow']);
    }

    public function test_content_section_order_is_saved_in_one_request(): void
    {
        $this->withAdminAuth()
            ->patch('/admin/content-order', ['order' => ['hero', 'crave_break', 'about', 'reservations_banner']])
            ->assertSessionHasNoErrors();

        $this->assertSame(
            ['hero', 'crave_break', 'about', 'reservations_banner'],
            ContentBlock::orderBy('sort_order')->pluck('section_key')->all()
        );
    }

    public function test_deleting_a_gallery_image_removes_its_uploaded_file(): void
    {
        Storage::fake('uploads');
        $this->withAdminAuth()->post('/admin/gallery', [
            'image' => UploadedFile::fake()->image('terrace.jpg'),
            'label' => 'Terrace',
        ]);
        $image = GalleryImage::latest('id')->first();
        $file = str_replace('/uploads/', '', $image->image);
        Storage::disk('uploads')->assertExists($file);

        $this->patch("/admin/gallery/{$image->id}", ['label' => 'Rooftop'])->assertSessionHasNoErrors();
        $this->assertSame('Rooftop', $image->fresh()->label);

        $this->delete("/admin/gallery/{$image->id}");
        Storage::disk('uploads')->assertMissing($file);
    }

    public function test_new_customer_is_not_sent_to_admin_after_registering(): void
    {
        $this->get('/admin')->assertRedirect('/login'); // stores /admin as the "intended" URL

        $this->post('/register', [
            'name' => 'QA Customer',
            'email' => 'qa-reg@test.local',
            'phone' => '03', // untouched pre-filled prefix = no phone
            'password' => 'QaTest#2026',
        ])->assertSessionHasNoErrors()->assertRedirect('/');
    }

    public function test_customer_login_ignores_an_admin_intended_url(): void
    {
        User::factory()->create(['email' => 'c@test.local', 'password' => bcrypt('secret123'), 'role' => User::ROLE_CUSTOMER]);
        $this->get('/admin');

        $this->post('/login', ['email' => 'c@test.local', 'password' => 'secret123'])->assertRedirect('/');
    }

    public function test_phone_numbers_must_look_real(): void
    {
        $payload = [
            'name' => 'QA Guest',
            'email' => 'guest@test.local',
            'date' => now()->addDay()->toDateString(),
            'time' => '19:30',
            'party_size' => 2,
        ];

        $this->post('/reservations', $payload + ['phone' => 'abc'])->assertSessionHasErrors('phone');
        $this->post('/reservations', $payload + ['phone' => '0112020263001234567'])->assertSessionHasErrors('phone');
        $this->post('/reservations', $payload + ['phone' => '0300-1234567'])->assertSessionHasNoErrors();
    }

    public function test_notifications_url_opened_in_a_tab_redirects_to_dashboard(): void
    {
        $this->withAdminAuth()->get('/admin/notifications')->assertRedirect('/admin');
        $this->getJson('/admin/notifications')->assertOk();
    }
}
