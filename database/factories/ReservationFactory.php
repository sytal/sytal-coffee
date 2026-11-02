<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->numerify('03##-#######'),
            'date' => fake()->dateTimeBetween('+1 day', '+2 weeks')->format('Y-m-d'),
            'time' => fake()->time('H:i'),
            'party_size' => fake()->numberBetween(1, 8),
            'requests' => fake()->optional()->sentence(),
            'status' => 'Pending',
        ];
    }
}
