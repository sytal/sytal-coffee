<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\NormalizesMenuItemInput;
use Illuminate\Foundation\Http\FormRequest;

class StoreMenuItemRequest extends FormRequest
{
    use NormalizesMenuItemInput;

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
            'price' => ['required', 'string', 'max:30', self::PRICE_RULE],
            'image' => ['nullable', 'image', 'max:4096'],
            'tags' => ['nullable', 'array', 'max:4'],
            'tags.*' => ['string', 'max:40'],
        ];
    }
}
