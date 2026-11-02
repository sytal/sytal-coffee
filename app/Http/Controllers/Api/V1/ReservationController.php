<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    public function __construct(protected ReservationService $reservations)
    {
    }

    public function store(StoreReservationRequest $request): JsonResponse
    {
        $reservation = $this->reservations->create($request->validated());

        return response()->json([
            'message' => 'Reservation submitted.',
            'data' => new ReservationResource($reservation),
        ], 201);
    }
}
