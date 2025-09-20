<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('colors', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Red, Blue, Black, White, etc.
            $table->string('hex_code')->nullable(); // #FF0000, #0000FF, etc.
            $table->string('display_name')->nullable(); // Full color name
            $table->integer('sort_order')->default(0); // For ordering in UI
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->unique('name');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colors');
    }
};
