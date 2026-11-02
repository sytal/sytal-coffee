<?php

use App\Http\Controllers\HomeController;
use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Models\ContactMessage;
use App\Models\GalleryImage;
use App\Models\MenuItem;
use App\Models\Reservation;
use App\Services\ContactMessageService;
use App\Services\GalleryImageService;
use App\Services\MenuItemService;
use App\Services\NewsletterService;
use App\Services\ReservationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index']);

Route::post('/reservations', function (StoreReservationRequest $request, ReservationService $reservationService) {
    $reservationService->create($request->validated());

    return back()->with('success', 'Your table is saved!');
})->name('reservations.store');

Route::post('/contact', function (StoreContactMessageRequest $request, ContactMessageService $contactMessageService) {
    $contactMessageService->create($request->validated());

    return back()->with('success', "Thanks! We'll be in touch soon.");
})->name('contact.store');

Route::post('/newsletter', function (SubscribeNewsletterRequest $request, NewsletterService $newsletterService) {
    $newsletterService->subscribe($request->validated()['email']);

    return back()->with('success', "You're subscribed!");
})->name('newsletter.store');

// Preview-only admin panel — intentionally no auth middleware.
// Wired to the real backend services/models below.
Route::prefix('admin')->group(function () {
    Route::get('/', function (ReservationService $reservationService, ContactMessageService $contactMessageService) {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'menuItems' => MenuItem::count(),
                'reservationsToday' => Reservation::whereDate('date', now()->toDateString())->count(),
                'unreadMessages' => ContactMessage::where('status', 'New')->count(),
            ],
            'recentReservations' => $reservationService->latest()->take(5)->values(),
            'recentMessages' => $contactMessageService->latest()->take(5)->values(),
        ]);
    })->name('admin.dashboard');

    Route::get('/menu', function (MenuItemService $menuItemService) {
        return Inertia::render('Admin/MenuItems', [
            'menuItems' => $menuItemService->search(null, null),
            'categories' => $menuItemService->categories(),
        ]);
    })->name('admin.menu');

    Route::post('/menu', function (StoreMenuItemRequest $request, MenuItemService $menuItemService) {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = '/storage/'.$request->file('image')->store('menu-items', 'public');
        }

        $menuItemService->create($data);

        return back()->with('success', 'Menu item added!');
    })->name('admin.menu.store');

    Route::put('/menu/{menuItem}', function (UpdateMenuItemRequest $request, MenuItem $menuItem, MenuItemService $menuItemService) {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = '/storage/'.$request->file('image')->store('menu-items', 'public');
        }

        $menuItemService->update($menuItem, $data);

        return back()->with('success', 'Menu item updated!');
    })->name('admin.menu.update');

    Route::delete('/menu/{menuItem}', function (MenuItem $menuItem, MenuItemService $menuItemService) {
        $menuItemService->delete($menuItem);

        return back()->with('success', 'Menu item deleted!');
    })->name('admin.menu.destroy');

    Route::get('/reservations', function (Request $request, ReservationService $reservationService) {
        return Inertia::render('Admin/Reservations', [
            'reservations' => $reservationService->latest($request->query('status')),
        ]);
    })->name('admin.reservations');

    Route::patch('/reservations/{reservation}/status', function (Request $request, Reservation $reservation, ReservationService $reservationService) {
        $request->validate([
            'status' => ['required', 'in:Pending,Confirmed,Cancelled'],
        ]);

        $reservationService->updateStatus($reservation, $request->input('status'));

        return back()->with('success', 'Reservation updated!');
    })->name('admin.reservations.status');

    Route::get('/messages', function (ContactMessageService $contactMessageService) {
        return Inertia::render('Admin/Messages', [
            'messages' => $contactMessageService->latest(),
        ]);
    })->name('admin.messages');

    Route::patch('/messages/{contactMessage}/read', function (ContactMessage $contactMessage, ContactMessageService $contactMessageService) {
        $contactMessageService->markRead($contactMessage);

        return back();
    })->name('admin.messages.read');

    Route::delete('/messages/{contactMessage}', function (ContactMessage $contactMessage, ContactMessageService $contactMessageService) {
        $contactMessageService->delete($contactMessage);

        return back()->with('success', 'Message deleted!');
    })->name('admin.messages.destroy');

    Route::get('/gallery', function (GalleryImageService $galleryImageService) {
        return Inertia::render('Admin/Gallery', [
            'images' => $galleryImageService->all(),
        ]);
    })->name('admin.gallery');

    Route::post('/gallery', function (Request $request, GalleryImageService $galleryImageService) {
        $request->validate([
            'image' => ['required', 'image', 'max:4096'],
            'label' => ['nullable', 'string', 'max:150'],
        ]);

        $path = '/storage/'.$request->file('image')->store('gallery', 'public');

        $galleryImageService->create([
            'image' => $path,
            'label' => $request->input('label') ?: 'Untitled',
            'sort_order' => GalleryImage::max('sort_order') + 1,
        ]);

        return back()->with('success', 'Image uploaded!');
    })->name('admin.gallery.store');

    Route::delete('/gallery/{galleryImage}', function (GalleryImage $galleryImage, GalleryImageService $galleryImageService) {
        $galleryImageService->delete($galleryImage);

        return back()->with('success', 'Image deleted!');
    })->name('admin.gallery.destroy');
});
