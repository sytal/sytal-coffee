<?php

namespace App\Http\Requests;

use App\Services\BusinessSettingsService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30', new \App\Rules\PhoneNumber],
            'date' => ['required', 'date', 'after_or_equal:today'],
            'time' => ['required', 'date_format:H:i', Rule::in(app(BusinessSettingsService::class)->timeSlots())],
            'party_size' => ['required', 'integer', 'min:1', 'max:20'],
            'requests' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'time.in' => 'Please pick one of the available times (we take bookings during opening hours).',
        ];
    }
}
