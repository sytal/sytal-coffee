<?php

namespace App\Services;

use App\Models\GalleryImage;
use Illuminate\Database\Eloquent\Collection;

class GalleryImageService
{
    public function all(): Collection
    {
        return GalleryImage::query()->orderBy('sort_order')->get();
    }

    public function create(array $data): GalleryImage
    {
        return GalleryImage::create($data);
    }

    public function updateLabel(GalleryImage $image, string $label): GalleryImage
    {
        $image->update(['label' => $label]);

        return $image;
    }

    public function delete(GalleryImage $image): void
    {
        $path = $image->image;
        $image->delete();
        \App\Support\UploadedImage::delete($path);
    }
}
