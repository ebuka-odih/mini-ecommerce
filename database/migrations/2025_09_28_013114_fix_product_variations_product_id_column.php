<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();
        
        // For MySQL, check and drop foreign key if it exists
        if ($driver === 'mysql') {
            $foreignKeyExists = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'product_variations' 
                AND COLUMN_NAME = 'product_id' 
                AND CONSTRAINT_NAME != 'PRIMARY'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ");
            
            if ($foreignKeyExists[0]->count > 0) {
                DB::statement("ALTER TABLE product_variations DROP FOREIGN KEY product_variations_product_id_foreign");
            }
        }
        
        // For SQLite, we need to check if the table exists and has the column
        if ($driver === 'sqlite') {
            // SQLite doesn't support dropping foreign keys or changing column types easily
            // We'll just ensure the column is correct
            if (Schema::hasColumn('product_variations', 'product_id')) {
                // For fresh migrations, the column should already be correct
                // Skip modification for SQLite as it's complex
                return;
            }
        }
        
        Schema::table('product_variations', function (Blueprint $table) use ($driver) {
            if ($driver === 'mysql') {
                // Change the column type from unsigned big integer to UUID
                $table->uuid('product_id')->change();
                
                // Re-add the foreign key constraint with proper UUID reference
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();
        
        // For MySQL, check and drop foreign key if it exists
        if ($driver === 'mysql') {
            $foreignKeyExists = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.KEY_COLUMN_USAGE 
                WHERE TABLE_SCHEMA = DATABASE() 
                AND TABLE_NAME = 'product_variations' 
                AND COLUMN_NAME = 'product_id' 
                AND CONSTRAINT_NAME != 'PRIMARY'
                AND REFERENCED_TABLE_NAME IS NOT NULL
            ");
            
            if ($foreignKeyExists[0]->count > 0) {
                DB::statement("ALTER TABLE product_variations DROP FOREIGN KEY product_variations_product_id_foreign");
            }
            
            Schema::table('product_variations', function (Blueprint $table) {
                // Change back to unsigned big integer (if needed for rollback)
                $table->unsignedBigInteger('product_id')->change();
                
                // Re-add the foreign key constraint
                $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            });
        }
        
        // For SQLite, skip the down migration as it's complex
    }
};