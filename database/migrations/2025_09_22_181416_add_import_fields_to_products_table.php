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
        Schema::table('products', function (Blueprint $table) {
            $table->string('external_id')->nullable()->after('sku');
            $table->text('source_url')->nullable()->after('external_id');
            $table->string('source_platform')->nullable()->after('source_url');
            $table->string('meta_title')->nullable()->after('source_platform');
            $table->text('meta_description')->nullable()->after('meta_title');
            $table->integer('stock_quantity')->default(0)->after('meta_description');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'external_id',
                'source_url',
                'source_platform',
                'meta_title',
                'meta_description',
                'stock_quantity'
            ]);
        });
    }
};