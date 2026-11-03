<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use App\Models\ThemeSetting;
use App\Services\ContentBlockService;
use App\Services\ThemeService;
use Illuminate\Database\Seeder;

class ContentBlockSeeder extends Seeder
{
    /**
     * Seeds content_blocks with today's hardcoded homepage copy/images
     * (so the site is pixel-identical on first load) and sets the active
     * theme to "classic_gold", which matches the current palette exactly.
     */
    public function run(): void
    {
        foreach (ContentBlockService::defaults() as $sectionKey => $default) {
            ContentBlock::updateOrCreate(
                ['section_key' => $sectionKey],
                [
                    'label' => $default['label'],
                    'sort_order' => $default['sort_order'],
                    'fields' => $default['fields'],
                ]
            );
        }

        ThemeSetting::updateOrCreate(
            ['key' => ThemeService::SETTING_KEY],
            ['value' => ThemeService::DEFAULT_PRESET]
        );
    }
}
