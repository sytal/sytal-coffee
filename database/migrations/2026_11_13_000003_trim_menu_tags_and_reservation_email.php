<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The tag suggestion list had grown to 70+ near-duplicates
        // ("Crisp", "Crispy", "Crispy Chicken"...). Keep a short curated
        // list; tags already on dishes stay on those dishes.
        DB::table('menu_tags')->whereNotIn('name', \Database\Seeders\MenuTagSeeder::TAGS)->delete();
        foreach (\Database\Seeders\MenuTagSeeder::TAGS as $name) {
            DB::table('menu_tags')->updateOrInsert(['name' => $name], ['updated_at' => now(), 'created_at' => now()]);
        }

        // Reservations now need a phone number; email is optional.
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
        });

        // Contact form: email is enough to reply; phone is optional.
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->string('phone')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
        });
    }
};
