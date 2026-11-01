<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

// Static UI preview only — no auth, no real data. Just so the admin
// panel's look/feel can be reviewed before any backend is built.
Route::prefix('admin')->group(function () {
    Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('admin.dashboard');
    Route::get('/menu', fn () => Inertia::render('Admin/MenuItems'))->name('admin.menu');
    Route::get('/reservations', fn () => Inertia::render('Admin/Reservations'))->name('admin.reservations');
    Route::get('/messages', fn () => Inertia::render('Admin/Messages'))->name('admin.messages');
    Route::get('/gallery', fn () => Inertia::render('Admin/Gallery'))->name('admin.gallery');
});
