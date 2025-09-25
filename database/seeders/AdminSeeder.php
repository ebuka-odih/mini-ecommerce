<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@site.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1234567890',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create additional admin users if needed
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@site.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '+1987654321',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create a regular user for testing
        User::create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'phone' => '+1555555555',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
