<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The sample dishes used unrelated stock photos (Loaded Fries showed a
 * lobster roll). Point them at matching photos, only where the dish still
 * uses a bundled sample image, never over a photo the owner uploaded.
 */
return new class extends Migration
{
    public function up(): void
    {
        foreach ([
            'The KAVO Loaded' => '/images/menu/kavo-loaded.jpg',
            'Peri Peri Fries' => '/images/menu/peri-peri-fries.jpg',
            'Smoky BBQ Fries' => '/images/menu/smoky-bbq-fries.jpg',
            'Classic Salted Fries' => '/images/menu/classic-salted-fries.jpg',
            'KAVO Signature Stack' => '/images/menu/signature-stack.jpg',
            'Smoky BBQ Burger' => '/images/menu/smoky-bbq-burger.jpg',
            'Zinger Crunch Burger' => '/images/menu/zinger-crunch-burger.jpg',
            'Cheese Melt Burger' => '/images/menu/cheese-melt-burger.jpg',
            'Nutella Overload Shake' => '/images/menu/nutella-shake.jpg',
            'Oreo Blast' => '/images/menu/oreo-blast.jpg',
            'Classic Lemonade' => '/images/menu/lemonade.jpg',
            'Iced Mocha Freeze' => '/images/menu/iced-mocha.jpg',
            'Molten Chocolate Brownie' => '/images/menu/molten-brownie.jpg',
            'Nutella Waffle' => '/images/menu/nutella-waffle.jpg',
            'Churros & Dip' => '/images/menu/churros.jpg',
        ] as $name => $image) {
            DB::table('menu_items')->where('name', $name)->where('image', 'like', '/images/%')->update(['image' => $image]);
        }
    }

    public function down(): void
    {
        //
    }
};
