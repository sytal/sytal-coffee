<?php

namespace App\Services;

use App\Models\ThemeSetting;

/**
 * Premium, elegant restaurant-vibe color presets. "classic_gold" matches
 * today's hardcoded palette exactly (resources/js/config/colors.js) so the
 * site looks unchanged until the owner picks a different preset.
 */
class ThemeService
{
    public const SETTING_KEY = 'active_theme';

    public const DEFAULT_PRESET = 'classic_gold';

    public static function presets(): array
    {
        return [
            'classic_gold' => [
                'name' => 'Classic Gold',
                'description' => 'Amber & gold on near-black \u{2014} the original Crunches look.',
                'colors' => [
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
            ],
            'midnight_emerald' => [
                'name' => 'Midnight Emerald',
                'description' => 'Deep emerald green with warm brass accents.',
                'colors' => [
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
            ],
            'burgundy_noir' => [
                'name' => 'Burgundy Noir',
                'description' => 'Rich wine-red on charcoal black with champagne gold.',
                'colors' => [
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
            ],
            'champagne_ivory' => [
                'name' => 'Champagne Ivory',
                'description' => 'Lighter elegant variant \u{2014} ivory & cream with soft gold.',
                'colors' => [
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
                'colors' => [
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
            ],
            'espresso_copper' => [
                'name' => 'Espresso Copper',
                'description' => 'Warm coffee brown with glowing copper accents.',
                'colors' => [
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
            ],
        ];
    }

    public function active(): array
    {
        $key = ThemeSetting::where('key', self::SETTING_KEY)->value('value') ?? self::DEFAULT_PRESET;
        $presets = static::presets();

        return [
            'key' => $key,
            'preset' => $presets[$key] ?? $presets[self::DEFAULT_PRESET],
        ];
    }

    public function setActive(string $presetKey): void
    {
        if (!array_key_exists($presetKey, static::presets())) {
            throw new \InvalidArgumentException("Unknown theme preset: {$presetKey}");
        }

        ThemeSetting::updateOrCreate(['key' => self::SETTING_KEY], ['value' => $presetKey]);
    }
}
