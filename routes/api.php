<?php

use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\GalleryImageController;
use App\Http\Controllers\Api\V1\MenuItemController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\ReservationController;
use Illuminate\Support\Facades\Route;

// Public API — no auth yet; add Sanctum if order history / user accounts are built later.
Route::prefix('v1')->group(function (): void {
    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-categories', [MenuItemController::class, 'categories']);
    Route::get('/gallery', [GalleryImageController::class, 'index']);

    Route::middleware('throttle:api')->group(function (): void {
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::post('/contact-messages', [ContactMessageController::class, 'store']);
        Route::post('/newsletter', [NewsletterController::class, 'store']);
    });
});
