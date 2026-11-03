<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Crunches Cafe') }}</title>

        <!-- Favicon -->
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="alternate icon" href="/favicon.ico" sizes="any">
        @php($activeTheme = app(\App\Services\ThemeService::class)->active())
        <meta name="theme-color" content="{{ $activeTheme['preset']['colors']['background'] }}">

        {{-- Active color theme (Admin > Appearance), injected before any paint so there's
             no flash of the wrong palette. Tailwind's brand.* classes resolve these
             CSS variables at runtime — see resources/js/config/colors.js. --}}
        <style>
            :root {
                @foreach ($activeTheme['preset']['colors'] as $name => $hex)
                    --brand-{{ $name }}: {{ $hex }};
                @endforeach
            }
        </style>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
        <link href="https://fonts.bunny.net/css?family=fraunces:400,500,600,700&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
