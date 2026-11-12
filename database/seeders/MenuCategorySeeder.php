<?php

namespace Database\Seeders;

use App\Services\MenuItemService;
use Illuminate\Database\Seeder;

/**
 * Fills menu_categories (and menu_tags) from the seeded menu items, so the
 * admin Category dropdown and tag picker are never empty after a fresh seed.
 */
class MenuCategorySeeder extends Seeder
{
    public function run(MenuItemService $menuItemService): void
    {
        $menuItemService->syncLookups();
    }
}
