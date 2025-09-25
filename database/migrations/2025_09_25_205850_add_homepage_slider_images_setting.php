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
        // Add the homepage slider images setting if it doesn't exist
        DB::table('settings')->insertOrIgnore([
            'key' => 'homepage_slider_images',
            'value' => '[]',
            'type' => 'json',
            'group' => 'frontend',
            'description' => 'Homepage slider images (JSON array of image IDs)',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('settings')->where('key', 'homepage_slider_images')->delete();
    }
};