<?php

namespace Database\Seeders;

use App\Models\MenuTag;
use Illuminate\Database\Seeder;

class MenuTagSeeder extends Seeder
{
    /** Short, distinct tag suggestions for the admin menu form. */
    public const TAGS = [
        'Best Seller', 'New', 'Chef Special', 'Spicy', 'Cheesy', 'Crispy',
        'Smoky BBQ', 'Sweet', 'Vegetarian', 'Shareable', 'Family Size',
        'Kids Favorite', 'Limited Time', 'Quick Bite', 'Value Meal',
    ];

    public function run(): void
    {
        foreach (self::TAGS as $name) {
            MenuTag::firstOrCreate(['name' => $name]);
        }
    }
}
