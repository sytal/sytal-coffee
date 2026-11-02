<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:150'],
            'category' => ['required', 'string', 'max:60'],
            'description' => ['required', 'string', 'max:500'],
            'price' => ['required', 'string', 'max:30'],
            'image' => ['nullable', 'image', 'max:4096'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:40'],
        ];
    }
}
