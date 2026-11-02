<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ContactMessageController;
use App\Http\Controllers\Api\V1\GalleryImageController;
use App\Http\Controllers\Api\V1\MenuItemController;
use App\Http\Controllers\Api\V1\NewsletterController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ReservationController;
use Illuminate\Support\Facades\Route;

// Public API — used by the Flutter app (and anything else) to browse the
// menu/gallery without an account. Sanctum now backs the authenticated
// routes below for order history and placing orders from the app.
Route::prefix('v1')->group(function (): void {
    Route::get('/menu-items', [MenuItemController::class, 'index']);
    Route::get('/menu-categories', [MenuItemController::class, 'categories']);
    Route::get('/gallery', [GalleryImageController::class, 'index']);

    Route::middleware('throttle:api')->group(function (): void {
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::post('/contact-messages', [ContactMessageController::class, 'store']);
        Route::post('/newsletter', [NewsletterController::class, 'store']);

        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    // Token-authenticated — the Flutter app sends `Authorization: Bearer <token>`
    // (the token returned by /register or /login above).
    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
    });
});
