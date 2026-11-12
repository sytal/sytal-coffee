<?php

namespace App\Services;

use App\Models\MenuCategory;
use App\Models\MenuItem;
use App\Models\MenuTag;
use App\Support\UploadedImage;
use Illuminate\Database\Eloquent\Collection;

class MenuItemService
{
    public function categories(): array
    {
        return MenuItem::query()
            ->orderBy('sort_order')
            ->pluck('category')
            ->unique()
            ->values()
            ->all();
    }

    public function all(): Collection
    {
        return MenuItem::query()->orderBy('sort_order')->orderBy('id')->get();
    }

    public function search(?string $query, ?string $category): Collection
    {
        return MenuItem::query()
            ->when($category && $category !== 'All', fn ($q) => $q->where('category', $category))
            ->when($query, fn ($q) => $q->where('name', 'like', "%{$query}%"))
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    /**
     * Make sure every category/tag used by a menu item also exists in the
     * menu_categories / menu_tags tables the admin dropdowns read from.
     * Without this the admin Category dropdown can be empty (or list only a
     * new category), so editing an item silently moved it.
     */
    public function syncLookups(): void
    {
        $existing = MenuCategory::pluck('name')->all();
        $next = (int) MenuCategory::max('sort_order');

        $used = MenuItem::query()->orderBy('sort_order')->orderBy('id')->pluck('category')->filter()->unique();
        foreach ($used as $name) {
            if (! in_array($name, $existing, true)) {
                MenuCategory::create(['name' => $name, 'sort_order' => ++$next]);
                $existing[] = $name;
            }
        }
    }

    /** @param  array<int, string>  $tags */
    public function rememberTags(array $tags): void
    {
        foreach (array_unique(array_map('trim', $tags)) as $tag) {
            if ($tag !== '') {
                MenuTag::firstOrCreate(['name' => $tag]);
            }
        }
    }

    public function create(array $data): MenuItem
    {
        $this->ensureCategory($data['category'] ?? null);
        $this->rememberTags($data['tags'] ?? []);

        return MenuItem::create($data);
    }

    public function update(MenuItem $item, array $data): MenuItem
    {
        $this->ensureCategory($data['category'] ?? null);
        $this->rememberTags($data['tags'] ?? []);

        $oldImage = $item->image;
        $item->update($data);

        if (array_key_exists('image', $data) && $oldImage !== $item->image) {
            UploadedImage::delete($oldImage);
        }

        return $item;
    }

    public function delete(MenuItem $item): void
    {
        $image = $item->image;
        $item->delete();
        UploadedImage::delete($image);
    }

    private function ensureCategory(?string $name): void
    {
        if ($name && ! MenuCategory::where('name', $name)->exists()) {
            MenuCategory::create(['name' => $name, 'sort_order' => (int) MenuCategory::max('sort_order') + 1]);
        }
    }
}
