<?php

namespace Database\Seeders;

use App\Models\GalleryImage;
use Illuminate\Database\Seeder;

class GalleryImageSeeder extends Seeder
{
    public function run(): void
    {
        $images = [
            ['image' => '/images/outdoors-of-the-restaurant.jpg', 'label' => 'The Terrace'],
            ['image' => '/images/fire-from-wok.jpg', 'label' => 'Open Kitchen'],
            ['image' => '/images/gallery/gallery-2.jpg', 'label' => 'The Dining Room'],
            ['image' => '/images/gallery/gallery-4.jpg', 'label' => 'Evening Service'],
            ['image' => '/images/chef-preparing-the-plates.jpg', 'label' => 'In the Kitchen'],
            ['image' => '/images/gallery/gallery-6.jpg', 'label' => 'Private Lounge'],
            ['image' => '/images/gallery/gallery-3.jpg', 'label' => 'Afternoon Light'],
            ['image' => '/images/gallery/gallery-7.jpg', 'label' => 'Bar Service'],
        ];

        foreach ($images as $index => $image) {
            GalleryImage::create($image + ['sort_order' => $index]);
        }
    }
}
