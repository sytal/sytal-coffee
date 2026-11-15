<?php

namespace App\Services;

use App\Models\ThemeSetting;

/**
 * Premium, elegant restaurant-vibe color presets, each with a "dark" and
 * "light" variant. "classic_gold" (dark) matches today's hardcoded
 * palette exactly (resources/js/config/colors.js) so the site looks
 * unchanged until the owner picks a different preset/mode.
 *
 * Mode ("dark" | "light" | "auto") is stored separately from the preset,
 * so the owner can force one — "auto" (the default, no explicit choice
 * made yet) falls back to the visitor's OS/device preference
 * (prefers-color-scheme on web, platformBrightness in the Flutter app).
 */
class ThemeService
{
    public const SETTING_KEY = 'active_theme';

    public const MODE_SETTING_KEY = 'theme_mode';

    public const DEFAULT_PRESET = 'classic_gold';

    public const DEFAULT_MODE = 'auto';

    public const MODES = ['dark', 'light', 'auto'];

    public static function presets(): array
    {
        return [
            'classic_gold' => [
                'name' => 'Classic Orange',
                'description' => 'Amber & gold — the original KAVO look.',
                'dark' => [
                    'background' => '#0c0b09',
                    'surface' => '#17140f',
                    'surfaceAlt' => '#1f1b15',
                    'border' => '#37332a',
                    'foreground' => '#f5f1e8',
                    'foregroundMuted' => '#b9b2a2',
                    'gold' => '#f4691f',
                    'goldLight' => '#ff9248',
                    'goldDark' => '#c44c13',
                    'success' => '#5fae70',
                    'danger' => '#db5c48',
                ],
                'light' => [
                    'background' => '#fbf3e4',
                    'surface' => '#f3e4c8',
                    'surfaceAlt' => '#ecd9b4',
                    'border' => '#d8c08a',
                    'foreground' => '#2a1d0a',
                    'foregroundMuted' => '#6b5636',
                    'gold' => '#9b4715',
                    'goldLight' => '#e0813c',
                    'goldDark' => '#96430f',
                    'success' => '#356942',
                    'danger' => '#a63a2a',
                ],
            ],
            'midnight_emerald' => [
                'name' => 'Fresh Emerald',
                'description' => 'Deep green with a bright mint accent — clearly different from the orange and wine looks.',
                'dark' => [
                    'background' => '#061a12',
                    'surface' => '#0b2a1d',
                    'surfaceAlt' => '#113524',
                    'border' => '#24533d',
                    'foreground' => '#eef6f0',
                    'foregroundMuted' => '#a8c6b4',
                    'gold' => '#3fbf86',
                    'goldLight' => '#6fd7a6',
                    'goldDark' => '#2a8f62',
                    'success' => '#5fae70',
                    'danger' => '#e0705e',
                ],
                'light' => [
                    'background' => '#eef6f0',
                    'surface' => '#dcebe1',
                    'surfaceAlt' => '#cbe0d2',
                    'border' => '#9fc4ad',
                    'foreground' => '#0d2a1c',
                    'foregroundMuted' => '#3f5d4b',
                    'gold' => '#1d6b47',
                    'goldLight' => '#2f9466',
                    'goldDark' => '#155236',
                    'success' => '#2f6b3f',
                    'danger' => '#a63a2a',
                ],
            ],
            'burgundy_noir' => [
                'name' => 'Burgundy Noir',
                'description' => 'Rich wine-red with champagne gold.',
                'dark' => [
                    'background' => '#0c0808',
                    'surface' => '#1a0f10',
                    'surfaceAlt' => '#241517',
                    'border' => '#4a2a2d',
                    'foreground' => '#f5ece6',
                    'foregroundMuted' => '#c1a9a8',
                    'gold' => '#c46a59',
                    'goldLight' => '#d86a4a',
                    'goldDark' => '#8a2f1f',
                    'success' => '#5fae70',
                    'danger' => '#e15042',
                ],
                'light' => [
                    'background' => '#f7ede6',
                    'surface' => '#efdfd4',
                    'surfaceAlt' => '#e6cfc1',
                    'border' => '#cfa891',
                    'foreground' => '#3a1210',
                    'foregroundMuted' => '#7a4f48',
                    'gold' => '#8a2f1f',
                    'goldLight' => '#b5452f',
                    'goldDark' => '#671f14',
                    'success' => '#346641',
                    'danger' => '#8a2f1f',
                ],
            ],
        ];
    }

    public function active(): array
    {
        $key = ThemeSetting::where('key', self::SETTING_KEY)->value('value') ?? self::DEFAULT_PRESET;
        $mode = ThemeSetting::where('key', self::MODE_SETTING_KEY)->value('value') ?? self::DEFAULT_MODE;
        $presets = static::presets();
        $preset = $presets[$key] ?? $presets[self::DEFAULT_PRESET];

        return [
            'key' => $presets[$key] ?? false ? $key : self::DEFAULT_PRESET,
            'mode' => in_array($mode, self::MODES, true) ? $mode : self::DEFAULT_MODE,
            'preset' => $preset,
        ];
    }

    public function setActive(string $presetKey): void
    {
        if (!array_key_exists($presetKey, static::presets())) {
            throw new \InvalidArgumentException("Unknown theme preset: {$presetKey}");
        }

        ThemeSetting::updateOrCreate(['key' => self::SETTING_KEY], ['value' => $presetKey]);
    }

    public function setMode(string $mode): void
    {
        if (!in_array($mode, self::MODES, true)) {
            throw new \InvalidArgumentException("Unknown theme mode: {$mode}");
        }

        ThemeSetting::updateOrCreate(['key' => self::MODE_SETTING_KEY], ['value' => $mode]);
    }

    /**
     * "#f4691f" -> "244 105 31" — the "R G B" channel-triplet format
     * resources/js/config/colors.js expects, so Tailwind's bg-brand-gold/40
     * style opacity modifiers can inject an alpha value into the color.
     */
    public static function hexToRgbTriplet(string $hex): string
    {
        $hex = ltrim($hex, '#');
        [$r, $g, $b] = array_map(fn ($c) => hexdec($c), str_split($hex, 2));

        return "{$r} {$g} {$b}";
    }
}
