<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Requests\StoreMenuItemRequest;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Http\Requests\UpdateMenuItemRequest;
use App\Models\ContactMessage;
use App\Models\GalleryImage;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\Reservation;
use App\Services\ContactMessageService;
use App\Services\ContentBlockService;
use App\Services\GalleryImageService;
use App\Services\MenuItemService;
use App\Services\NewsletterService;
use App\Services\OrderService;
use App\Services\ReservationService;
use App\Services\ThemeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index']);

// The homepage "View Menu" link is a same-page scroll anchor (#menu), not a
// real route — any direct hit on /menu, bookmark, or shared link 404'd.
// Redirect it to that anchor so it actually works standalone.
Route::get('/menu', fn () => redirect('/#menu'));

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

Route::get('/login', [LoginController::class, 'create'])->name('login');
Route::post('/login', [LoginController::class, 'store']);
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');
Route::get('/register', [RegisterController::class, 'create'])->name('register');
Route::post('/register', [RegisterController::class, 'store']);

// Placing an order requires a signed-in customer; browsing the public menu
// above does not. Any guest hitting these gets bounced to /login and, once
// signed in, redirect()->intended() below sends them right back here.
Route::middleware('auth')->group(function () {
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/my-orders', [OrderController::class, 'mine'])->name('orders.mine');
});

// Role-gated admin panel, wired to the real backend services/models below.
Route::prefix('admin')->middleware(['auth', 'role:admin,manager'])->group(function () {
    Route::get('/', function (ReservationService $reservationService, ContactMessageService $contactMessageService) {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'menuItems' => MenuItem::count(),
                'reservationsToday' => Reservation::whereDate('date', now()->toDateString())->count(),
                'unreadMessages' => ContactMessage::where('status', 'New')->count(),
                'ordersToday' => Order::whereDate('created_at', now()->toDateString())->count(),
            ],
            'recentReservations' => $reservationService->latest()->take(5)->values(),
            'recentMessages' => $contactMessageService->latest()->take(5)->values(),
        ]);
    })->name('admin.dashboard');

    // Feeds the notification bell dropdown: unread contact messages +
    // pending orders, newest first. Kept deliberately small (count-bounded)
    // since it's polled every 15s.
    Route::get('/notifications', function () {
        $readMessageIds = \App\Models\NotificationRead::where('type', 'message')->pluck('ref_id');
        $readOrderIds = \App\Models\NotificationRead::where('type', 'order')->pluck('ref_id');

        $messages = ContactMessage::where('status', 'New')
            ->whereNotIn('id', $readMessageIds)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($m) => [
                'type' => 'message',
                'id' => $m->id,
                'title' => 'New message from '.$m->name,
                'subtitle' => $m->message,
                'href' => '/admin/messages',
            ]);

        $orders = Order::where('status', 'Pending')
            ->whereNotIn('id', $readOrderIds)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($o) => [
                'type' => 'order',
                'id' => $o->id,
                'title' => 'New order #'.$o->id,
                'subtitle' => 'Rs. '.number_format($o->total).' — '.($o->delivery_address ?? ''),
                'href' => '/admin/orders',
            ]);

        return response()->json($messages->concat($orders)->sortByDesc('id')->values());
    })->name('admin.notifications');

    Route::post('/notifications/read', function (Request $request) {
        $request->validate([
            'type' => ['required', 'in:message,order'],
            'id' => ['required', 'integer'],
        ]);

        \App\Models\NotificationRead::updateOrCreate(
            ['type' => $request->input('type'), 'ref_id' => $request->input('id')],
            ['read_at' => now()]
        );

        return response()->noContent();
    })->name('admin.notifications.read');

    Route::post('/notifications/read-all', function () {
        $readMessageIds = \App\Models\NotificationRead::where('type', 'message')->pluck('ref_id');
        $readOrderIds = \App\Models\NotificationRead::where('type', 'order')->pluck('ref_id');

        $rows = ContactMessage::where('status', 'New')->whereNotIn('id', $readMessageIds)
            ->pluck('id')
            ->map(fn ($id) => ['type' => 'message', 'ref_id' => $id, 'read_at' => now()])
            ->concat(
                Order::where('status', 'Pending')->whereNotIn('id', $readOrderIds)
                    ->pluck('id')
                    ->map(fn ($id) => ['type' => 'order', 'ref_id' => $id, 'read_at' => now()])
            );

        foreach ($rows as $row) {
            \App\Models\NotificationRead::updateOrCreate(
                ['type' => $row['type'], 'ref_id' => $row['ref_id']],
                ['read_at' => $row['read_at']]
            );
        }

        return response()->noContent();
    })->name('admin.notifications.read-all');

    Route::get('/menu', function (MenuItemService $menuItemService) {
        return Inertia::render('Admin/MenuItems', [
            'menuItems' => $menuItemService->search(null, null),
            'categories' => \App\Models\MenuCategory::orderBy('sort_order')->get(['id', 'name']),
            'availableTags' => \App\Models\MenuTag::orderBy('name')->pluck('name'),
        ]);
    })->name('admin.menu');

    Route::post('/categories', function (Request $request) {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:60', 'unique:menu_categories,name'],
        ]);
        $data['sort_order'] = \App\Models\MenuCategory::max('sort_order') + 1;
        \App\Models\MenuCategory::create($data);

        return back()->with('success', 'Category added!');
    })->name('admin.categories.store');

    Route::put('/categories/{menuCategory}', function (Request $request, \App\Models\MenuCategory $menuCategory) {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:60', 'unique:menu_categories,name,'.$menuCategory->id],
        ]);
        $oldName = $menuCategory->name;
        $menuCategory->update($data);
        // Keep existing menu items pointed at the renamed category.
        MenuItem::where('category', $oldName)->update(['category' => $data['name']]);

        return back()->with('success', 'Category updated!');
    })->name('admin.categories.update');

    Route::delete('/categories/{menuCategory}', function (\App\Models\MenuCategory $menuCategory) {
        if (MenuItem::where('category', $menuCategory->name)->exists()) {
            return back()->with('error', 'Move or delete items in this category first.');
        }
        $menuCategory->delete();

        return back()->with('success', 'Category deleted!');
    })->name('admin.categories.destroy');

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

    // Website Content — section-by-section text/images for the public homepage.
    // Icons are deliberately NOT editable here (owner constraint); only text
    // and images, per section, ordered via sort_order.
    Route::get('/content', function (ContentBlockService $contentBlockService) {
        return Inertia::render('Admin/Content', [
            'blocks' => $contentBlockService->all(),
        ]);
    })->name('admin.content');

    Route::post('/content/{sectionKey}', function (Request $request, string $sectionKey, ContentBlockService $contentBlockService) {
        $fields = $request->input('fields', []);
        if (!is_array($fields)) {
            $fields = [];
        }

        // Any image_* files sent (e.g. image, images[0], items[0][image]) get
        // stored under storage/app/public/content and swapped in as paths,
        // same upload pattern used by Admin/Gallery and Admin/MenuItems.
        foreach ($request->allFiles() as $key => $file) {
            if (!str_starts_with($key, 'upload_')) {
                continue;
            }
            $path = '/storage/'.$file->store('content', 'public');
            $target = substr($key, strlen('upload_'));
            data_set($fields, $target, $path);
        }

        $contentBlockService->updateFields($sectionKey, $fields);

        return back()->with('success', 'Section updated!');
    })->name('admin.content.update');

    Route::patch('/content/{sectionKey}/order', function (Request $request, string $sectionKey, ContentBlockService $contentBlockService) {
        $request->validate(['sort_order' => ['required', 'integer', 'min:0']]);
        $contentBlockService->updateSortOrder($sectionKey, (int) $request->input('sort_order'));

        return back()->with('success', 'Order updated!');
    })->name('admin.content.order');

    // Appearance — pick one of the premium color-theme presets (each with a
    // dark and light variant) plus a dark/light/auto mode; together they
    // become the website's (and, via the API, the app's) active color
    // combination. "Auto" mode (the default until the owner forces one)
    // falls back to the visitor's own OS/device preference.
    Route::get('/appearance', function (ThemeService $themeService) {
        $active = $themeService->active();

        return Inertia::render('Admin/Appearance', [
            'presets' => $themeService::presets(),
            'active' => $active['key'],
            'mode' => $active['mode'],
        ]);
    })->name('admin.appearance');

    Route::patch('/appearance', function (Request $request, ThemeService $themeService) {
        $request->validate([
            'theme' => ['nullable', 'string', 'in:'.implode(',', array_keys(ThemeService::presets()))],
            'mode' => ['nullable', 'string', 'in:'.implode(',', ThemeService::MODES)],
        ]);

        if ($request->filled('theme')) {
            $themeService->setActive($request->input('theme'));
        }
        if ($request->filled('mode')) {
            $themeService->setMode($request->input('mode'));
        }

        return back()->with('success', 'Appearance updated!');
    })->name('admin.appearance.update');

    Route::get('/orders', function (OrderService $orderService) {
        return Inertia::render('Admin/Orders', [
            'orders' => $orderService->all(),
        ]);
    })->name('admin.orders');

    // Lightweight polling endpoint for the admin Orders page. No websocket
    // broadcasting driver is configured in this project (no Reverb/Pusher),
    // so "live" order notifications are done via a cheap interval poll
    // instead of a persistent connection. `since` is either the last known
    // order id or an ISO timestamp; we return just a count + markers so the
    // client can decide whether to prompt a refresh, never the full list.
    Route::get('/orders/latest-check', function (Request $request, OrderService $orderService) {
        $since = $request->query('since');

        return response()->json($orderService->latestCheck($since));
    })->name('admin.orders.latest-check');

    Route::patch('/orders/{order}/status', function (Request $request, Order $order, OrderService $orderService) {
        $request->validate([
            'status' => ['required', 'in:Pending,Preparing,Out for Delivery,Completed,Cancelled'],
        ]);

        $orderService->updateStatus($order, $request->input('status'));

        return back()->with('success', 'Order updated!');
    })->name('admin.orders.status');
});
