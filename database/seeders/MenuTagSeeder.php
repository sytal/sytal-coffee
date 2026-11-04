<?php

namespace Database\Seeders;

use App\Models\MenuTag;
use Illuminate\Database\Seeder;

class MenuTagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            'Spicy', 'Hand-Cut', 'Crowd Favorite', 'Fan Favorite', 'Best Seller',
            'New', 'Chef Special', 'Signature', 'Loaded', 'Smoky', 'BBQ',
            'Cheesy', 'Crispy', 'Creamy', 'Sweet', 'Tangy', 'Savory', 'Spicy Hot',
            'Mild', 'Gluten-Free', 'Vegetarian', 'Vegan', 'Halal', 'Grilled',
            'Fried', 'Baked', 'Fresh', 'Homemade', 'Family Size', 'Kids Favorite',
            'Limited Time', 'Seasonal', 'Combo Deal', 'Value Meal', 'Premium',
            'Protein Packed', 'Light Bite', 'Street Style', 'Classic', 'Fusion',
            'Spicy Mayo', 'Garlic Lovers', 'Cheese Lovers', 'Loaded Toppings',
            'Must Try', 'Trending', 'Top Rated', 'Shareable', 'Hearty', 'Quick Bite',
        ];

        foreach ($tags as $name) {
            MenuTag::firstOrCreate(['name' => $name]);
        }
    }
}
