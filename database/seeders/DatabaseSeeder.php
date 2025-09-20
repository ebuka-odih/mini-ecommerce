<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
    

        // Call the AdminSeeder
        $this->call([
            AdminSeeder::class,
        ]);

        // Call the Size and Color seeders
        $this->call([
            SizeSeeder::class,
            ColorSeeder::class,
        ]);

        // Call the ProductSeeder
        $this->call([
            ProductSeeder::class,
        ]);
    }
}
