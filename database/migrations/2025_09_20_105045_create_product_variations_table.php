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
        Schema::create('product_variations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('size_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('color_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('sku')->unique()->nullable(); // Unique SKU for this variation
            $table->decimal('price', 10, 2)->nullable(); // Override price for this variation
            $table->integer('stock_quantity')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('attributes')->nullable(); // Additional variation attributes
            $table->timestamps();
            
            $table->unique(['product_id', 'size_id', 'color_id']);
            $table->index(['product_id', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_variations');
    }
};
