<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ContentBlockService;
use Illuminate\Http\JsonResponse;

class ContentBlockController extends Controller
{
    public function __construct(protected ContentBlockService $contentBlocks)
    {
    }

    /** Public, unauthenticated — used by the Flutter app to render the same
     *  marketing copy/images as the website, sourced from the database. */
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => $this->contentBlocks->all(),
        ]);
    }
}
