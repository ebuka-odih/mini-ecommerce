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
        Schema::create('homepage_layouts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('grid_position'); // 'hero', 'main_left', 'main_right_top', 'main_right_bottom', 'secondary_left', 'secondary_center', 'secondary_right'
            $table->string('section_name');
            $table->uuid('category_id')->nullable();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
            $table->string('background_color')->nullable();
            $table->string('text_color')->default('white');
            $table->string('gradient_from')->nullable(); // Tailwind color class
            $table->string('gradient_to')->nullable(); // Tailwind color class
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->string('grid_size')->default('normal'); // 'small', 'normal', 'large'
            $table->string('custom_link')->nullable(); // Override category link
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
            $table->unique(['grid_position', 'is_active']); // Only one active layout per position
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('homepage_layouts');
    }
};
