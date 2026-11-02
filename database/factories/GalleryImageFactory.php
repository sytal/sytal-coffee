<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class GalleryImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'image' => '/images/gallery/gallery-1.jpg',
            'label' => fake()->words(2, true),
            'sort_order' => fake()->numberBetween(0, 10),
        ];
    }
}
