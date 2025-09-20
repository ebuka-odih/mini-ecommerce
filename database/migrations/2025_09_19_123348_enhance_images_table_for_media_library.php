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
        Schema::table('images', function (Blueprint $table) {
            // Media library specific fields
            $table->string('folder')->nullable()->after('disk'); // Organization folder
            $table->string('tags')->nullable()->after('metadata'); // Comma-separated tags
            $table->timestamp('uploaded_at')->nullable()->after('updated_at'); // Upload timestamp
            $table->uuid('uploaded_by')->nullable()->after('uploaded_at'); // User who uploaded
            $table->integer('width')->nullable()->after('size'); // Image width
            $table->integer('height')->nullable()->after('width'); // Image height
            $table->string('color_palette')->nullable()->after('height'); // Dominant colors (JSON)
            $table->boolean('is_optimized')->default(false)->after('is_featured'); // Optimization status
            $table->integer('download_count')->default(0)->after('is_optimized'); // Usage tracking
            $table->timestamp('last_used_at')->nullable()->after('download_count'); // Last usage
            $table->text('usage_context')->nullable()->after('last_used_at'); // Where it's being used
            
            // Indexes for better performance
            $table->index(['folder', 'uploaded_at']);
            $table->index(['tags']);
            $table->index(['uploaded_by']);
            $table->index(['mime_type']);
            $table->index(['is_featured', 'is_optimized']);
            
            // Foreign key for uploader
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('images', function (Blueprint $table) {
            $table->dropForeign(['uploaded_by']);
            $table->dropIndex(['folder', 'uploaded_at']);
            $table->dropIndex(['tags']);
            $table->dropIndex(['uploaded_by']);
            $table->dropIndex(['mime_type']);
            $table->dropIndex(['is_featured', 'is_optimized']);
            
            $table->dropColumn([
                'folder',
                'tags',
                'uploaded_at',
                'uploaded_by',
                'width',
                'height',
                'color_palette',
                'is_optimized',
                'download_count',
                'last_used_at',
                'usage_context'
            ]);
        });
    }
};