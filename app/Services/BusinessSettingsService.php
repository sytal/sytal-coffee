<?php

namespace App\Services;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

/**
 * Business info the owner edits in Admin > Business Info: contact details,
 * social links, opening hours and the delivery fee. The website footer,
 * contact section, reservation time slots, the order total and the Flutter
 * app (via /api/v1/business) all read from here instead of hardcoded text.
 */
class BusinessSettingsService
{
    private const CACHE_KEY = 'business_settings';

    public static function defaults(): array
    {
        return [
            'phone' => '',
            'whatsapp' => '',
            'email' => '',
            'address' => 'Gulberg Thana Road, Faisalabad',
            'instagram' => '',
            'facebook' => '',
            'open_time' => '13:00',
            'close_time' => '01:00',
            'delivery_fee' => 0,
        ];
    }

    public function all(): array
    {
        $stored = Cache::rememberForever(self::CACHE_KEY, fn () => SiteSetting::pluck('value', 'key')->all());
        $settings = array_merge(static::defaults(), array_intersect_key($stored, static::defaults()));
        $settings['delivery_fee'] = (int) $settings['delivery_fee'];

        return $settings + [
            'hours_label' => $this->hoursLabel($settings['open_time'], $settings['close_time']),
            'whatsapp_url' => $this->whatsappUrl($settings['whatsapp']),
        ];
    }

    public function update(array $data): void
    {
        foreach (array_intersect_key($data, static::defaults()) as $key => $value) {
            SiteSetting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
        }
        Cache::forget(self::CACHE_KEY);
    }

    public function deliveryFee(): int
    {
        return $this->all()['delivery_fee'];
    }

    /**
     * Bookable reservation times: every 30 minutes from opening until one
     * hour before closing. Handles hours that run past midnight (1pm–1am).
     *
     * @return array<int, string> "HH:MM" values
     */
    public function timeSlots(): array
    {
        $settings = $this->all();
        $open = $this->minutes($settings['open_time']);
        $close = $this->minutes($settings['close_time']);
        if ($close <= $open) {
            $close += 24 * 60;
        }

        $slots = [];
        for ($m = $open; $m <= $close - 60; $m += 30) {
            $slots[] = sprintf('%02d:%02d', intdiv($m % 1440, 60), $m % 60);
        }

        return $slots;
    }

    private function minutes(string $time): int
    {
        [$h, $m] = array_map('intval', explode(':', $time) + [0, 0]);

        return $h * 60 + $m;
    }

    private function hoursLabel(string $open, string $close): string
    {
        return 'Daily, '.$this->format12($open).' – '.$this->format12($close);
    }

    private function format12(string $time): string
    {
        [$h, $m] = array_map('intval', explode(':', $time) + [0, 0]);
        $suffix = $h >= 12 ? 'pm' : 'am';
        $h12 = $h % 12 === 0 ? 12 : $h % 12;

        return $m ? sprintf('%d:%02d%s', $h12, $m, $suffix) : $h12.$suffix;
    }

    private function whatsappUrl(?string $number): string
    {
        $digits = preg_replace('/\D/', '', (string) $number);
        if ($digits === '') {
            return '';
        }
        // Local Pakistani format 03xx… → international 923xx…
        if (str_starts_with($digits, '0')) {
            $digits = '92'.substr($digits, 1);
        }

        return 'https://wa.me/'.$digits;
    }
}
