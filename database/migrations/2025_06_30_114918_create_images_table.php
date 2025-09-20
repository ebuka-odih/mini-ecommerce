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
        Schema::create('images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('filename');
            $table->string('original_name');
            $table->string('mime_type');
            $table->string('extension');
            $table->string('path');
            $table->string('disk')->default('public');
            $table->unsignedBigInteger('size');
            $table->string('imageable_type')->nullable();
            $table->uuid('imageable_id')->nullable();
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['imageable_type', 'imageable_id']);
            $table->index(['is_featured']);
            $table->index(['sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};
