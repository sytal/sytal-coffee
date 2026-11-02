<?php

namespace App\Services;

use App\Models\MenuItem;
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
        return MenuItem::query()->orderBy('category')->orderBy('sort_order')->get();
    }

    public function search(?string $query, ?string $category): Collection
    {
        return MenuItem::query()
            ->when($category && $category !== 'All', fn ($q) => $q->where('category', $category))
            ->when($query, fn ($q) => $q->where('name', 'like', "%{$query}%"))
            ->orderBy('sort_order')
            ->get();
    }

    public function create(array $data): MenuItem
    {
        return MenuItem::create($data);
    }

    public function update(MenuItem $item, array $data): MenuItem
    {
        $item->update($data);

        return $item;
    }

    public function delete(MenuItem $item): void
    {
        $item->delete();
    }
}
