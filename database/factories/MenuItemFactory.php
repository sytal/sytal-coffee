<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MenuItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->words(3, true),
            'category' => fake()->randomElement(['Loaded Fries', 'Burgers', 'Shakes & Drinks', 'Desserts']),
            'description' => fake()->sentence(12),
            'price' => 'Rs. '.fake()->numberBetween(300, 1000),
            'image' => '/images/menu/bread-barrel.jpg',
            'tags' => fake()->randomElements(['Spicy', 'Loaded', 'Classic'], 2),
            'sort_order' => fake()->numberBetween(0, 20),
            'is_available' => true,
        ];
    }
}
