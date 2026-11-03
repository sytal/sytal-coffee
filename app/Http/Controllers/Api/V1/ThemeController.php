<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ThemeService;
use Illuminate\Http\JsonResponse;

class ThemeController extends Controller
{
    public function __construct(protected ThemeService $themes)
    {
    }

    /** Public, unauthenticated — the active theme's palette, for the Flutter app. */
    public function show(): JsonResponse
    {
        $active = $this->themes->active();

        return response()->json([
            'data' => [
                'key' => $active['key'],
                'name' => $active['preset']['name'],
                'colors' => $active['preset']['colors'],
            ],
        ]);
    }
}
