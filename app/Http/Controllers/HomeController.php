<?php

namespace App\Http\Controllers;

use App\Services\GalleryImageService;
use App\Services\MenuItemService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(MenuItemService $menuItemService, GalleryImageService $galleryImageService): Response
    {
        return Inertia::render('Home', [
            'menuItems' => $menuItemService->all(),
            'menuCategories' => $menuItemService->categories(),
            'galleryImages' => $galleryImageService->all(),
        ]);
    }
}
