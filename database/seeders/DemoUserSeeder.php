<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Public demo logins for the showcase deployment. Runs only when DEMO_MODE=true.
 */
class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        if (! config('demo.enabled')) {
            $this->command?->warn('DEMO_MODE is off — skipping demo users.');

            return;
        }

        User::query()->updateOrCreate(
            ['email' => config('demo.admin.email')],
            [
                'name' => 'Demo Admin',
                'password' => Hash::make(config('demo.admin.password')),
                'role' => User::ROLE_ADMIN,
                'email_verified_at' => now(),
            ],
        );

        User::query()->updateOrCreate(
            ['email' => config('demo.customer.email')],
            [
                'name' => 'Demo Customer',
                'phone' => '03001234567',
                'password' => Hash::make(config('demo.customer.password')),
                'role' => User::ROLE_CUSTOMER,
                'email_verified_at' => now(),
            ],
        );
    }
}
