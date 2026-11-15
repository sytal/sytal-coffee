<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'KAVO') }}</title>

        <!-- Favicon -->
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <meta name="description" content="KAVO — Coffee Brings Energy. Handcrafted coffee, loaded fries, burgers and desserts in Faisalabad. Order online or book a table.">
        <meta property="og:title" content="KAVO — Coffee Brings Energy">
        <meta property="og:description" content="Handcrafted coffee, loaded fries, burgers and desserts in Faisalabad. Order online or book a table.">
        <meta property="og:image" content="{{ url('/images/brand/og-image.jpg') }}">
        <meta property="og:type" content="website">
        @php($activeTheme = app(\App\Services\ThemeService::class)->active())
        @php($darkColors = $activeTheme['preset']['dark'])
        @php($lightColors = $activeTheme['preset']['light'])
        @php($mode = $activeTheme['mode'])
        <meta name="theme-color" content="{{ $mode === 'light' ? $lightColors['background'] : $darkColors['background'] }}">

        {{-- Active color theme + light/dark mode (Admin > Appearance), injected before
             any paint so there's no flash of the wrong palette. Tailwind's brand.*
             classes resolve these CSS variables at runtime — see
             resources/js/config/colors.js. If the owner hasn't forced a mode
             ("auto", the default), we fall back to the visitor's OS preference via
             prefers-color-scheme; otherwise the forced mode always wins. --}}
        <style>
            @if ($mode === 'dark')
                :root {
                    @foreach ($darkColors as $name => $hex)
                        --brand-{{ $name }}-rgb: {{ \App\Services\ThemeService::hexToRgbTriplet($hex) }};
                    @endforeach
                }
            @elseif ($mode === 'light')
                :root {
                    @foreach ($lightColors as $name => $hex)
                        --brand-{{ $name }}-rgb: {{ \App\Services\ThemeService::hexToRgbTriplet($hex) }};
                    @endforeach
                }
            @else
                :root {
                    @foreach ($darkColors as $name => $hex)
                        --brand-{{ $name }}-rgb: {{ \App\Services\ThemeService::hexToRgbTriplet($hex) }};
                    @endforeach
                }
                @media (prefers-color-scheme: light) {
                    :root {
                        @foreach ($lightColors as $name => $hex)
                            --brand-{{ $name }}-rgb: {{ \App\Services\ThemeService::hexToRgbTriplet($hex) }};
                        @endforeach
                    }
                }
            @endif
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
