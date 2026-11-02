<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->index();
            $table->string('phone');
            $table->date('date')->index();
            $table->time('time');
            $table->unsignedTinyInteger('party_size')->default(2);
            $table->text('requests')->nullable();
            $table->string('status')->default('Pending')->index(); // Pending | Confirmed | Cancelled
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
