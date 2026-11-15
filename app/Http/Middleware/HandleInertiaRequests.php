<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                // Only what the UI needs — never timestamps or other internals.
                'user' => $request->user()?->only(['id', 'name', 'email', 'phone', 'role']),
                'is_demo' => \App\Http\Middleware\DemoReadOnly::isDemoAdmin($request->user()),
            ],
            // Phone, socials, hours, delivery fee — edited in Admin > Business Info.
            'business' => fn () => app(\App\Services\BusinessSettingsService::class)->all()
                + ['time_slots' => app(\App\Services\BusinessSettingsService::class)->timeSlots()],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
