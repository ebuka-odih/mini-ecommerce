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
        Schema::create('sizes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // XS, S, M, L, XL, XXL
            $table->string('display_name')->nullable(); // Extra Small, Small, Medium, etc.
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
        Schema::dropIfExists('sizes');
    }
};
