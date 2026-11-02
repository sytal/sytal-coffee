<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Http\Resources\ContactMessageResource;
use App\Services\ContactMessageService;
use Illuminate\Http\JsonResponse;

class ContactMessageController extends Controller
{
    public function __construct(protected ContactMessageService $contactMessages)
    {
    }

    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = $this->contactMessages->create($request->validated());

        return response()->json([
            'message' => 'Message sent.',
            'data' => new ContactMessageResource($message),
        ], 201);
    }
}
