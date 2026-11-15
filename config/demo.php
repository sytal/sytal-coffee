<?php

/*
 * Public demo accounts for a portfolio / showcase deployment.
 *
 * When DEMO_MODE=true, `php artisan db:seed --class=DemoUserSeeder` creates
 * both accounts, and the demo admin can browse every admin screen but cannot
 * change anything (see App\Http\Middleware\DemoReadOnly).
 */
return [
    'enabled' => (bool) env('DEMO_MODE', false),

    'admin' => [
        'email' => env('DEMO_ADMIN_EMAIL', 'demo.admin@crunchescafe.com'),
        'password' => env('DEMO_ADMIN_PASSWORD', 'DemoAdmin#2026'),
    ],

    'customer' => [
        'email' => env('DEMO_CUSTOMER_EMAIL', 'demo.customer@crunchescafe.com'),
        'password' => env('DEMO_CUSTOMER_PASSWORD', 'DemoCustomer#2026'),
    ],
];
