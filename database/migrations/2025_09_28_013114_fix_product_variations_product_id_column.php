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
            // Drop the existing foreign key constraint
            $table->dropForeign(['product_id']);
            
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
            // Drop the foreign key constraint
            $table->dropForeign(['product_id']);
            
            // Change back to unsigned big integer (if needed for rollback)
            $table->unsignedBigInteger('product_id')->change();
            
            // Re-add the foreign key constraint
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
        });
    }
};