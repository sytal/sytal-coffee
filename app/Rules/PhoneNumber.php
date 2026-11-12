<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * A real-looking phone number: digits with optional leading "+", spaces,
 * dashes or brackets, and 10–13 digits in total (covers 03001234567,
 * +92 300 1234567, 042-35761234). Rejects letters and junk like "abc".
 */
class PhoneNumber implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = trim((string) $value);
        $digits = preg_replace('/\D/', '', $value);

        if (! preg_match('/^\+?[0-9\s\-()]+$/', $value) || strlen($digits) < 10 || strlen($digits) > 13) {
            $fail('Please enter a valid phone number, e.g. 03001234567.');
        }
    }
}
