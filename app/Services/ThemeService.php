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
                'name' => 'Classic Gold',
                'description' => 'Amber & gold \u{2014} the original Crunches look.',
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
                    'danger' => '#d6462f',
                ],
                'light' => [
                    'background' => '#fbf3e4',
                    'surface' => '#f3e4c8',
                    'surfaceAlt' => '#ecd9b4',
                    'border' => '#d8c08a',
                    'foreground' => '#2a1d0a',
                    'foregroundMuted' => '#6b5636',
                    'gold' => '#c2591a',
                    'goldLight' => '#e0813c',
                    'goldDark' => '#96430f',
                    'success' => '#3f7d4f',
                    'danger' => '#a63a2a',
                ],
            ],
            'midnight_emerald' => [
                'name' => 'Midnight Emerald',
                'description' => 'Deep emerald green with warm brass accents.',
                'dark' => [
                    'background' => '#07120e',
                    'surface' => '#0e1f17',
                    'surfaceAlt' => '#16291f',
                    'border' => '#2d4538',
                    'foreground' => '#f2f3ea',
                    'foregroundMuted' => '#aebfb2',
                    'gold' => '#c9a24b',
                    'goldLight' => '#e3c072',
                    'goldDark' => '#9a7a30',
                    'success' => '#4fae7d',
                    'danger' => '#d6462f',
                ],
                'light' => [
                    'background' => '#f6f3e8',
                    'surface' => '#ece6d2',
                    'surfaceAlt' => '#e1d9bf',
                    'border' => '#c9bb94',
                    'foreground' => '#16261d',
                    'foregroundMuted' => '#51604f',
                    'gold' => '#9a7a30',
                    'goldLight' => '#c9a24b',
                    'goldDark' => '#6e551f',
                    'success' => '#3f7d4f',
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
                    'gold' => '#b5452f',
                    'goldLight' => '#d86a4a',
                    'goldDark' => '#8a2f1f',
                    'success' => '#5fae70',
                    'danger' => '#e0493a',
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
                    'success' => '#3f7d4f',
                    'danger' => '#8a2f1f',
                ],
            ],
            'champagne_ivory' => [
                'name' => 'Champagne Ivory',
                'description' => 'Lighter elegant variant \u{2014} ivory & cream with soft gold.',
                'dark' => [
                    'background' => '#15110a',
                    'surface' => '#201a10',
                    'surfaceAlt' => '#2a2215',
                    'border' => '#4a3c22',
                    'foreground' => '#f3ecd9',
                    'foregroundMuted' => '#b9ab85',
                    'gold' => '#c99a42',
                    'goldLight' => '#e8c166',
                    'goldDark' => '#96721f',
                    'success' => '#3f7d4f',
                    'danger' => '#a63a2a',
                ],
                'light' => [
                    'background' => '#f8f3e9',
                    'surface' => '#f1e8d6',
                    'surfaceAlt' => '#e9ddc4',
                    'border' => '#d8c6a1',
                    'foreground' => '#2a2418',
                    'foregroundMuted' => '#6b5f45',
                    'gold' => '#a8792b',
                    'goldLight' => '#c99a42',
                    'goldDark' => '#7f5a1d',
                    'success' => '#3f7d4f',
                    'danger' => '#a63a2a',
                ],
            ],
            'royal_sapphire' => [
                'name' => 'Royal Sapphire',
                'description' => 'Deep navy blue with warm gold for an upscale dinner feel.',
                'dark' => [
                    'background' => '#070a14',
                    'surface' => '#0e1526',
                    'surfaceAlt' => '#161f33',
                    'border' => '#2d3b58',
                    'foreground' => '#f1f2f6',
                    'foregroundMuted' => '#a9b1c4',
                    'gold' => '#d4a63a',
                    'goldLight' => '#e8c166',
                    'goldDark' => '#a37f25',
                    'success' => '#4fae7d',
                    'danger' => '#d6462f',
                ],
                'light' => [
                    'background' => '#f3f1e6',
                    'surface' => '#e8e4d2',
                    'surfaceAlt' => '#dcd6bd',
                    'border' => '#b9ad88',
                    'foreground' => '#101a30',
                    'foregroundMuted' => '#4d5569',
                    'gold' => '#a37f25',
                    'goldLight' => '#d4a63a',
                    'goldDark' => '#7f6019',
                    'success' => '#3f7d4f',
                    'danger' => '#a63a2a',
                ],
            ],
            'espresso_copper' => [
                'name' => 'Espresso Copper',
                'description' => 'Warm coffee brown with glowing copper accents.',
                'dark' => [
                    'background' => '#120d0a',
                    'surface' => '#1d1510',
                    'surfaceAlt' => '#271c14',
                    'border' => '#473627',
                    'foreground' => '#f6efe6',
                    'foregroundMuted' => '#bfa998',
                    'gold' => '#c2703a',
                    'goldLight' => '#e08f55',
                    'goldDark' => '#95521f',
                    'success' => '#5fae70',
                    'danger' => '#d6462f',
                ],
                'light' => [
                    'background' => '#f7efe4',
                    'surface' => '#efe2d0',
                    'surfaceAlt' => '#e5d2b8',
                    'border' => '#cbab84',
                    'foreground' => '#2a1a0f',
                    'foregroundMuted' => '#6b5240',
                    'gold' => '#95521f',
                    'goldLight' => '#c2703a',
                    'goldDark' => '#6e3c13',
                    'success' => '#3f7d4f',
                    'danger' => '#a63a2a',
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
}
