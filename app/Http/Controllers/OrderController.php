<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Website (session-auth) ordering endpoints. Placing an order requires a
 * logged-in user — enforced by the 'auth' middleware on these routes in
 * routes/web.php — but browsing the public menu stays open to everyone.
 */
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderService $orderService): RedirectResponse
    {
        $order = $orderService->create($request->user(), $request->validated());

        return back()->with('success', "Order #{$order->id} placed! We'll start preparing it shortly.");
    }

    public function mine(Request $request, OrderService $orderService): Response
    {
        return Inertia::render('Orders/Mine', [
            'orders' => $orderService->forUser($request->user()),
        ]);
    }
}
