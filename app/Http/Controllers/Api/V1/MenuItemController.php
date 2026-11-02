<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\MenuItemResource;
use App\Services\MenuItemService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function __construct(protected MenuItemService $menuItems)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $items = $this->menuItems->search(
            $request->query('q'),
            $request->query('category'),
        );

        return response()->json([
            'data' => MenuItemResource::collection($items),
        ]);
    }

    public function categories(): JsonResponse
    {
        return response()->json([
            'data' => $this->menuItems->categories(),
        ]);
    }
}
