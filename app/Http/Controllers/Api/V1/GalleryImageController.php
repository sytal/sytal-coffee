<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryImageResource;
use App\Services\GalleryImageService;
use Illuminate\Http\JsonResponse;

class GalleryImageController extends Controller
{
    public function __construct(protected GalleryImageService $galleryImages)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => GalleryImageResource::collection($this->galleryImages->all()),
        ]);
    }
}
