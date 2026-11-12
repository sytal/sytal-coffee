<?php

namespace App\Http\Requests\Concerns;

/**
 * Shared by the store/update menu item requests: a price must be a number
 * (optionally typed as "Rs. 650" or "1,200") and is stored in one
 * consistent display format, "Rs. 1,200", so the website never shows a bare
 * "999" or free text like "abc".
 */
trait NormalizesMenuItemInput
{
    protected const PRICE_RULE = 'regex:/^\s*(rs\.?\s*)?\d{1,3}(,?\d{3})*(\.\d{1,2})?\s*$/i';

    protected function prepareForValidation(): void
    {
        $price = (string) $this->input('price', '');

        // Only reformat values that are already valid; anything else is
        // left untouched so the regex rule rejects it with a clear message.
        if ($price !== '' && preg_match('/^\s*(rs\.?\s*)?\d{1,3}(,?\d{3})*(\.\d{1,2})?\s*$/i', $price)) {
            preg_match('/[\d,]+(\.\d+)?/', $price, $m);
            $number = (float) str_replace(',', '', $m[0]);
            $decimals = fmod($number, 1.0) === 0.0 ? 0 : 2;
            $this->merge(['price' => 'Rs. '.number_format($number, $decimals)]);
        }
    }

    public function messages(): array
    {
        return [
            'price.regex' => 'Enter the price as a number, e.g. 650 or Rs. 650.',
            'image.uploaded' => 'The image could not be uploaded. Use a JPG or PNG under 4 MB.',
            'image.max' => 'The image must be 4 MB or smaller.',
            'image.image' => 'The file must be an image (JPG, PNG or WebP).',
        ];
    }
}
