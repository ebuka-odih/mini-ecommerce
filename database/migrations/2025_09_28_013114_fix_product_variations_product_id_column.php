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
        Schema::table('product_variations', function (Blueprint $table) {
            // Try to drop the existing foreign key constraint
            try {
                $table->dropForeign(['product_id']);
            } catch (\Illuminate\Database\QueryException $e) {
                // Foreign key doesn't exist or has different name, continue
                \Log::info('Foreign key for product_id does not exist or has different name, continuing...');
            }
            
            // Change the column type from unsigned big integer to UUID
            $table->uuid('product_id')->change();
            
            // Re-add the foreign key constraint with proper UUID reference
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variations', function (Blueprint $table) {
            // Try to drop the existing foreign key constraint
            try {
                $table->dropForeign(['product_id']);
            } catch (\Illuminate\Database\QueryException $e) {
                // Foreign key doesn't exist or has different name, continue
                \Log::info('Foreign key for product_id does not exist or has different name, continuing...');
            }
            
            // Change back to unsigned big integer (if needed for rollback)
            $table->unsignedBigInteger('product_id')->change();
            
            // Re-add the foreign key constraint
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }
};