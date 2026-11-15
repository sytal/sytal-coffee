<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            MenuItemSeeder::class,
            MenuCategorySeeder::class,
            MenuTagSeeder::class,
            GalleryImageSeeder::class,
            ContentBlockSeeder::class,
            DemoUserSeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
