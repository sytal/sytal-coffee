<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:150'],
            'category' => ['sometimes', 'required', 'string', 'max:60'],
            'description' => ['sometimes', 'required', 'string', 'max:500'],
            'price' => ['sometimes', 'required', 'string', 'max:30'],
            'image' => ['nullable', 'image', 'max:4096'],
            'tags' => ['nullable', 'array', 'max:4'],
            'tags.*' => ['string', 'max:40'],
            'is_available' => ['sometimes', 'boolean'],
        ];
    }
}
