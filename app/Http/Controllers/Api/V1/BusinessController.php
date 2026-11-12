<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\BusinessSettingsService;
use Illuminate\Http\JsonResponse;

class BusinessController extends Controller
{
    /** Public: contact details, hours, reservation slots and delivery fee for the app. */
    public function show(BusinessSettingsService $business): JsonResponse
    {
        return response()->json([
            'data' => $business->all() + ['time_slots' => $business->timeSlots()],
        ]);
    }
}
