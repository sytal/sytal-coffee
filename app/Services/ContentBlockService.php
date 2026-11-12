<?php

namespace App\Services;

use App\Models\ContentBlock;

/**
 * Keeps the public site's editable marketing copy/images in the database,
 * while guaranteeing the site renders identically to the original
 * hardcoded design if a row is ever missing — defaults() below mirrors the
 * original hardcoded content from Hero.jsx / About.jsx / CraveBreak.jsx /
 * Reservations.jsx exactly.
 */
class ContentBlockService
{
    /**
     * Default fields per section, matching today's hardcoded content.
     * Also used by the seeder and as a fallback if a DB row is missing.
     */
    public static function defaults(): array
    {
        return [
            'hero' => [
                'label' => 'Homepage Hero',
                'sort_order' => 1,
                'fields' => [
                    'eyebrow' => '',
                    'title' => 'Crunches Cafe',
                    'subtitle' => "Faisalabad\u{2019}s favorite fast food hangout \u{2014} loaded fries, stacked burgers, and desserts built for sharing (or not).",
                    'cta_label' => 'Book a Table',
                    'secondary_label' => 'View the Menu',
                    'images' => [
                        '/images/hero-bg.jpg',
                        '/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg',
                        '/images/chef-preparing-the-plates.jpg',
                        '/images/outdoors-of-the-restaurant.jpg',
                        '/images/nicely-plated-food-served-at-decorated-table.jpg',
                    ],
                ],
            ],
            'about' => [
                'label' => 'About Section',
                'sort_order' => 2,
                'fields' => [
                    'eyebrow' => 'Our Story',
                    'heading' => 'Built on Late Nights & Loaded Plates',
                    'quote' => "No fuss, no pretense \u{2014} just a kitchen that doesn\u{2019}t slow down after dark.",
                    'body' => implode("\n\n", [
                        "Crunches started on Gulberg Thana Road with one idea: Faisalabad deserved a late-night spot that didn't cut corners on flavor. No fuss, no pretense \u{2014} just loaded fries, stacked burgers, and a kitchen that doesn't slow down after dark.",
                        "Today it's the spot where the crew lands after a long day \u{2014} neon signage out front, a menu built for sharing (or not), and a kitchen that's always running hot.",
                        "From crispy loaded fries to our signature stacked burgers and that molten chocolate brownie everyone talks about, every item earns its spot on the menu the hard way: by actually being good.",
                        "We're not trying to be fine dining. We're trying to be the place you crave at 11pm \u{2014} and the reviews say we're getting it right.",
                    ]),
                    'image' => '/images/about.jpg',
                ],
            ],
            'crave_break' => [
                'label' => 'Crave Break Strip',
                'sort_order' => 3,
                'fields' => [
                    'eyebrow' => 'Before You Order',
                    'heading' => 'Still deciding?',
                    'items' => [
                        ['image' => '/images/fire-from-wok.jpg', 'word' => 'Sizzling'],
                        ['image' => '/images/menu/lobster-roll.jpg', 'word' => 'Loaded'],
                        ['image' => '/images/menu/cake.jpg', 'word' => 'Molten'],
                        ['image' => '/images/chef-preparing-the-plates.jpg', 'word' => 'Fresh Off the Grill'],
                    ],
                ],
            ],
            'reservations_banner' => [
                'label' => 'Reservations Section',
                'sort_order' => 4,
                'fields' => [
                    'eyebrow' => 'Save Your Seat',
                    'heading' => 'Reserve a Table',
                    'intro' => "Claim your table before the kitchen runs out of today's cravings. We hold reservations for fifteen minutes past the booked time.",
                    'image' => '/images/fancy-salmon-dish-with-wine-glasses-in-background.jpg',
                    'panel_eyebrow' => 'Reserved for the Hungry',
                    'panel_heading' => 'A table worth craving.',
                ],
            ],
        ];
    }

    /** All sections keyed by section_key, DB rows merged over defaults, sorted by sort_order. */
    public function all(): array
    {
        $defaults = static::defaults();
        $rows = ContentBlock::all()->keyBy('section_key');

        $merged = [];
        foreach ($defaults as $key => $default) {
            $row = $rows->get($key);
            $merged[$key] = [
                'section_key' => $key,
                'label' => $row?->label ?? $default['label'],
                'sort_order' => $row?->sort_order ?? $default['sort_order'],
                'fields' => array_merge($default['fields'], $row?->fields ?? []),
            ];
        }

        // Include any extra rows an admin may have added beyond the known defaults.
        foreach ($rows as $key => $row) {
            if (!isset($merged[$key])) {
                $merged[$key] = [
                    'section_key' => $key,
                    'label' => $row->label,
                    'sort_order' => $row->sort_order,
                    'fields' => $row->fields,
                ];
            }
        }

        uasort($merged, fn ($a, $b) => $a['sort_order'] <=> $b['sort_order']);

        return array_values($merged);
    }

    /** Same data as all(), but keyed by section_key for quick lookup when rendering the homepage. */
    public function allKeyed(): array
    {
        $keyed = [];
        foreach ($this->all() as $block) {
            $keyed[$block['section_key']] = $block;
        }

        return $keyed;
    }

    public function updateFields(string $sectionKey, array $fields): ContentBlock
    {
        $defaults = static::defaults();
        $default = $defaults[$sectionKey] ?? ['label' => $sectionKey, 'sort_order' => 99];

        $block = ContentBlock::firstOrNew(['section_key' => $sectionKey]);
        $block->label = $block->label ?? $default['label'];
        $block->sort_order = $block->sort_order ?? $default['sort_order'];
        $previous = array_merge($default['fields'] ?? [], $block->fields ?? []);
        $block->fields = array_merge($previous, $fields);
        $block->save();

        // Remove uploaded images that this save replaced, so swapping a
        // section photo doesn't leave orphan files in public/uploads.
        $stillUsed = static::uploadPaths($block->fields);
        foreach (array_diff(static::uploadPaths($previous), $stillUsed) as $orphan) {
            \App\Support\UploadedImage::delete($orphan);
        }

        return $block;
    }

    /** @return array<int, string> every "/uploads/..." string inside a (nested) fields array */
    private static function uploadPaths(array $fields): array
    {
        $paths = [];
        array_walk_recursive($fields, function ($value) use (&$paths) {
            if (is_string($value) && str_starts_with($value, '/uploads/')) {
                $paths[] = $value;
            }
        });

        return array_values(array_unique($paths));
    }

    /**
     * Save the full section order in one go (1-based), so a single "move"
     * click can't half-apply when two separate requests race each other.
     *
     * @param  array<int, string>  $sectionKeys
     */
    public function reorder(array $sectionKeys): void
    {
        foreach (array_values($sectionKeys) as $i => $key) {
            $this->updateSortOrder($key, $i + 1);
        }
    }

    public function updateSortOrder(string $sectionKey, int $sortOrder): void
    {
        $defaults = static::defaults();
        $default = $defaults[$sectionKey] ?? ['label' => $sectionKey, 'fields' => []];

        $block = ContentBlock::firstOrNew(['section_key' => $sectionKey]);
        if (!$block->exists) {
            $block->label = $default['label'];
            $block->fields = $default['fields'];
        }
        $block->sort_order = $sortOrder;
        $block->save();
    }
}
