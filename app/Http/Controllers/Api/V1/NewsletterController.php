<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Services\NewsletterService;
use Illuminate\Http\JsonResponse;

class NewsletterController extends Controller
{
    public function __construct(protected NewsletterService $newsletter)
    {
    }

    public function store(SubscribeNewsletterRequest $request): JsonResponse
    {
        $this->newsletter->subscribe($request->validated()['email']);

        return response()->json([
            'message' => 'Subscribed.',
        ], 201);
    }
}
