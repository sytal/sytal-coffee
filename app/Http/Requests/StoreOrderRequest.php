<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ordering requires an authenticated user; the 'auth' / 'auth:sanctum'
        // route middleware already guarantees a user is logged in before this
        // request class runs, so this just double-checks.
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'delivery_address' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30', new \App\Rules\PhoneNumber],
            'notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => [
                'required', 'integer',
                \Illuminate\Validation\Rule::exists('menu_items', 'id')->where('is_available', true),
            ],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.*.menu_item_id.exists' => 'An item in your cart is sold out right now. Please remove it and try again.',
        ];
    }
}
