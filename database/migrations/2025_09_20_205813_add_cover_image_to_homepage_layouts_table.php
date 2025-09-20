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
        Schema::table('homepage_layouts', function (Blueprint $table) {
            $table->string('cover_image_id')->nullable()->after('category_id');
            $table->boolean('use_custom_cover')->default(false)->after('cover_image_id');
            $table->text('cover_image_url')->nullable()->after('use_custom_cover');
            $table->string('layout_type')->default('grid')->after('cover_image_url'); // 'slider' or 'grid'
            $table->integer('slider_speed')->default(5000)->after('layout_type'); // For slider layouts
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('homepage_layouts', function (Blueprint $table) {
            $table->dropColumn(['cover_image_id', 'use_custom_cover', 'cover_image_url', 'layout_type', 'slider_speed']);
        });
    }
};