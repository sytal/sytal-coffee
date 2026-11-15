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
use App\Services\BusinessSettingsService;
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

// Sign-in / sign-up pages are for guests only; a signed-in visitor is sent
// to the admin panel (staff) or the homepage (customers) instead.
Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'store']);
    Route::get('/register', [RegisterController::class, 'create'])->name('register');
    Route::post('/register', [RegisterController::class, 'store']);
});
Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

// Placing an order requires a signed-in customer; browsing the public menu
// above does not. Any guest hitting these gets bounced to /login and, once
// signed in, redirect()->intended() below sends them right back here.
Route::middleware('auth')->group(function () {
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/my-orders', [OrderController::class, 'mine'])->name('orders.mine');
});

// Role-gated admin panel, wired to the real backend services/models below.
Route::prefix('admin')->middleware(['auth', 'role:admin,manager', 'demo.readonly'])->group(function () {
    Route::get('/', function (ContactMessageService $contactMessageService) {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'menuItems' => MenuItem::count(),
                'soldOut' => MenuItem::where('is_available', false)->count(),
                'reservationsToday' => Reservation::whereDate('date', now()->toDateString())->count(),
                'pendingReservations' => Reservation::where('status', 'Pending')->count(),
                'unreadMessages' => ContactMessage::where('status', 'New')->count(),
                'ordersToday' => Order::whereDate('created_at', now()->toDateString())->count(),
                'activeOrders' => Order::whereIn('status', ['Pending', 'Preparing', 'Out for Delivery'])->count(),
            ],
            'recentOrders' => Order::with('user:id,name')->latest()->take(5)->get(),
            // Newest bookings first (by when they were made), not by visit date.
            'recentReservations' => Reservation::latest()->take(5)->get(),
            'recentMessages' => $contactMessageService->latest()->take(5)->values(),
        ]);
    })->name('admin.dashboard');

    // Feeds the notification bell dropdown: unread contact messages +
    // pending orders, newest first. Kept deliberately small (count-bounded)
    // since it's polled every 15s.
    Route::get('/notifications', function (Request $request) {
        // This endpoint only feeds the bell dropdown; opened directly in a
        // tab it would show raw JSON, so send people to the dashboard.
        if (! $request->expectsJson() && ! $request->ajax()) {
            return redirect('/admin');
        }

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
                'href' => '/admin/messages?open='.$m->id,
                'created_at' => $m->created_at,
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
                'href' => '/admin/orders?open='.$o->id,
                'created_at' => $o->created_at,
            ]);

        $readReservationIds = \App\Models\NotificationRead::where('type', 'reservation')->pluck('ref_id');
        $reservations = Reservation::where('status', 'Pending')
            ->whereNotIn('id', $readReservationIds)
            ->latest()
            ->take(10)
            ->get()
            ->map(fn ($r) => [
                'type' => 'reservation',
                'id' => $r->id,
                'title' => 'New booking: '.$r->name,
                'subtitle' => $r->party_size.' guests · '.$r->date->format('D j M').' at '.date('g:i A', strtotime($r->time)),
                'href' => '/admin/reservations?open='.$r->id,
                'created_at' => $r->created_at,
            ]);

        // Newest first across all three kinds (ids aren't comparable
        // between tables, so sort by creation time).
        return response()->json(
            $messages->concat($orders)->concat($reservations)
                ->sortByDesc(fn ($n) => (string) $n['created_at'])
                ->values()
        );
    })->name('admin.notifications');

    Route::post('/notifications/read', function (Request $request) {
        $request->validate([
            'type' => ['required', 'in:message,order,reservation'],
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
            )
            ->concat(
                Reservation::where('status', 'Pending')
                    ->whereNotIn('id', \App\Models\NotificationRead::where('type', 'reservation')->pluck('ref_id'))
                    ->pluck('id')
                    ->map(fn ($id) => ['type' => 'reservation', 'ref_id' => $id, 'read_at' => now()])
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
        $menuItemService->syncLookups();

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
            $data['image'] = '/uploads/'.$request->file('image')->store('menu-items', 'uploads');
        }

        $menuItemService->create($data);

        return back()->with('success', 'Menu item added!');
    })->name('admin.menu.store');

    Route::put('/menu/{menuItem}', function (UpdateMenuItemRequest $request, MenuItem $menuItem, MenuItemService $menuItemService) {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $data['image'] = '/uploads/'.$request->file('image')->store('menu-items', 'uploads');
        }

        $menuItemService->update($menuItem, $data);

        return back()->with('success', 'Menu item updated!');
    })->name('admin.menu.update');

    // One-click "Sold out today" switch on each menu row.
    Route::patch('/menu/{menuItem}/availability', function (Request $request, MenuItem $menuItem) {
        $data = $request->validate(['is_available' => ['required', 'boolean']]);
        $menuItem->update($data);

        return back()->with('success', $menuItem->name.($data['is_available'] ? ' is back on the menu.' : ' marked sold out.'));
    })->name('admin.menu.availability');

    // Move a dish up or down within the menu (display order).
    Route::patch('/menu/{menuItem}/move', function (Request $request, MenuItem $menuItem) {
        $data = $request->validate(['direction' => ['required', 'in:up,down']]);
        $siblings = MenuItem::where('category', $menuItem->category)->orderBy('sort_order')->orderBy('id')->get()->values();
        $index = $siblings->search(fn ($i) => $i->id === $menuItem->id);
        $swapWith = $siblings->get($data['direction'] === 'up' ? $index - 1 : $index + 1);

        if ($swapWith) {
            // Renumber the whole category first so equal sort_orders can't stall a move.
            $siblings->each(fn ($item, $i) => $item->sort_order !== $i * 10 && $item->update(['sort_order' => $i * 10]));
            $a = $menuItem->fresh();
            $b = $swapWith->fresh();
            [$aOrder, $bOrder] = [$a->sort_order, $b->sort_order];
            $a->update(['sort_order' => $bOrder]);
            $b->update(['sort_order' => $aOrder]);
        }

        return back();
    })->name('admin.menu.move');

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

    Route::delete('/reservations/{reservation}', function (Reservation $reservation, ReservationService $reservationService) {
        $reservationService->delete($reservation);

        return back()->with('success', 'Reservation deleted.');
    })->name('admin.reservations.destroy');

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

    // Accepts one image (`image` + `label`) or several at once
    // (`images[]` + `labels[]`), so the owner can add a batch in one go.
    Route::post('/gallery', function (Request $request, GalleryImageService $galleryImageService) {
        $messages = [
            '*.uploaded' => 'An image could not be uploaded. Use a JPG or PNG under 4 MB.',
            '*.max' => 'Each image must be 4 MB or smaller.',
            '*.image' => 'Each file must be an image (JPG, PNG or WebP).',
        ];
        if ($request->hasFile('images')) {
            $request->validate([
                'images' => ['required', 'array', 'min:1', 'max:20'],
                'images.*' => ['image', 'max:4096'],
                'labels' => ['nullable', 'array'],
                'labels.*' => ['nullable', 'string', 'max:150'],
            ], $messages + ['images.*.max' => 'Each image must be 4 MB or smaller.']);
            $files = $request->file('images');
            $labels = $request->input('labels', []);
        } else {
            $request->validate([
                'image' => ['required', 'image', 'max:4096'],
                'label' => ['nullable', 'string', 'max:150'],
            ], $messages + ['image.max' => 'The image must be 4 MB or smaller.']);
            $files = [$request->file('image')];
            $labels = [$request->input('label')];
        }

        foreach ($files as $i => $file) {
            $galleryImageService->create([
                'image' => '/uploads/'.$file->store('gallery', 'uploads'),
                'label' => ($labels[$i] ?? null) ?: 'Untitled',
                'sort_order' => GalleryImage::max('sort_order') + 1,
            ]);
        }

        return back()->with('success', count($files) > 1 ? count($files).' images uploaded!' : 'Image uploaded!');
    })->name('admin.gallery.store');

    Route::patch('/gallery/{galleryImage}', function (Request $request, GalleryImage $galleryImage, GalleryImageService $galleryImageService) {
        $data = $request->validate(['label' => ['required', 'string', 'max:150']]);
        $galleryImageService->updateLabel($galleryImage, $data['label']);

        return back()->with('success', 'Label updated!');
    })->name('admin.gallery.update');

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
        // The admin form sends `fields` as a JSON string inside multipart
        // form data (so files can travel alongside it). Decode it — treating
        // it as "not an array" silently dropped every text edit.
        $fields = $request->input('fields', []);
        if (is_string($fields)) {
            $fields = json_decode($fields, true);
        }
        if (! is_array($fields)) {
            return back()->with('error', 'Could not read the section fields. Please try again.');
        }

        $request->validate(
            collect($request->allFiles())->keys()->filter(fn ($k) => str_starts_with($k, 'upload_'))
                ->mapWithKeys(fn ($k) => [$k => ['image', 'max:4096']])->all(),
            [
                '*.uploaded' => 'An image could not be uploaded. Use a JPG or PNG under 4 MB.',
                '*.max' => 'Images must be 4 MB or smaller.',
                '*.image' => 'Uploads must be images (JPG, PNG or WebP).',
            ]
        );

        // Any image_* files sent (e.g. image, images[0], items[0][image]) get
        // stored under public/uploads/content and swapped in as paths,
        // same upload pattern used by Admin/Gallery and Admin/MenuItems.
        foreach ($request->allFiles() as $key => $file) {
            if (!str_starts_with($key, 'upload_')) {
                continue;
            }
            $path = '/uploads/'.$file->store('content', 'uploads');
            $target = substr($key, strlen('upload_'));
            data_set($fields, $target, $path);
        }

        $contentBlockService->updateFields($sectionKey, $fields);

        return back()->with('success', 'Section updated!');
    })->name('admin.content.update');

    Route::patch('/content-order', function (Request $request, ContentBlockService $contentBlockService) {
        $keys = array_keys(ContentBlockService::defaults());
        $data = $request->validate([
            'order' => ['required', 'array', 'size:'.count($keys)],
            'order.*' => ['required', 'string', 'distinct', 'in:'.implode(',', $keys)],
        ]);
        $contentBlockService->reorder($data['order']);

        return back()->with('success', 'Order updated!');
    })->name('admin.content.reorder');

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

    // Business Info — phone, WhatsApp, socials, address, opening hours and
    // delivery fee. Feeds the website footer/contact, reservation time
    // slots, order totals and the app.
    Route::get('/business', function (BusinessSettingsService $business) {
        return Inertia::render('Admin/Business', ['settings' => $business->all()]);
    })->name('admin.business');

    Route::put('/business', function (Request $request, BusinessSettingsService $business) {
        $data = $request->validate([
            'phone' => ['nullable', 'string', 'max:30', new \App\Rules\PhoneNumber],
            'whatsapp' => ['nullable', 'string', 'max:30', new \App\Rules\PhoneNumber],
            'email' => ['nullable', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'instagram' => ['nullable', 'url', 'max:255'],
            'facebook' => ['nullable', 'url', 'max:255'],
            'open_time' => ['required', 'date_format:H:i'],
            'close_time' => ['required', 'date_format:H:i', 'different:open_time'],
            'delivery_fee' => ['required', 'integer', 'min:0', 'max:5000'],
        ], [
            'instagram.url' => 'Paste the full link, e.g. https://instagram.com/crunchescafe',
            'facebook.url' => 'Paste the full link, e.g. https://facebook.com/crunchescafe',
            'close_time.different' => 'Closing time must be different from opening time.',
        ]);
        $business->update($data);

        return back()->with('success', 'Business info saved!');
    })->name('admin.business.update');

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
