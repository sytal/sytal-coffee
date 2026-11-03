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

    /** Public, unauthenticated — the active theme's palette (both dark and
     *  light variants) plus the owner's forced mode ("dark"|"light"|"auto"),
     *  for the Flutter app. When mode is "auto" the app should fall back to
     *  the device's own light/dark preference. */
    public function show(): JsonResponse
    {
        $active = $this->themes->active();

        return response()->json([
            'data' => [
                'key' => $active['key'],
                'name' => $active['preset']['name'],
                'mode' => $active['mode'],
                'dark' => $active['preset']['dark'],
                'light' => $active['preset']['light'],
            ],
        ]);
    }
}
