<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Http\Request;

/**
 * Token-authenticated (Sanctum) ordering endpoints for the Flutter app —
 * the same OrderService and StoreOrderRequest the website's OrderController
 * uses, so both clients create orders through identical validation/pricing.
 */
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderService $orderService)
    {
        $order = $orderService->create($request->user(), $request->validated());

        return OrderResource::make($order)->response()->setStatusCode(201);
    }

    public function index(Request $request, OrderService $orderService)
    {
        return OrderResource::collection($orderService->forUser($request->user()));
    }
}
