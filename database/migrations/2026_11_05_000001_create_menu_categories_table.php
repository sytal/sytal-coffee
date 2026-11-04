<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Seed from whatever categories already exist on menu_items so the
        // Items tab's dropdown doesn't go blank after this migration runs.
        $existing = \App\Models\MenuItem::query()
            ->whereNotNull('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        foreach ($existing as $i => $name) {
            \Illuminate\Support\Facades\DB::table('menu_categories')->insert([
                'name' => $name,
                'sort_order' => $i,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_categories');
    }
};
