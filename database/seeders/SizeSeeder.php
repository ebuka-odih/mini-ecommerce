<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sizes = [
            ['name' => 'XS', 'display_name' => 'Extra Small', 'sort_order' => 1],
            ['name' => 'S', 'display_name' => 'Small', 'sort_order' => 2],
            ['name' => 'M', 'display_name' => 'Medium', 'sort_order' => 3],
            ['name' => 'L', 'display_name' => 'Large', 'sort_order' => 4],
            ['name' => 'XL', 'display_name' => 'Extra Large', 'sort_order' => 5],
            ['name' => 'XXL', 'display_name' => '2X Large', 'sort_order' => 6],
            ['name' => 'XXXL', 'display_name' => '3X Large', 'sort_order' => 7],
            // Numeric sizes
            ['name' => '28', 'display_name' => 'Size 28', 'sort_order' => 8],
            ['name' => '30', 'display_name' => 'Size 30', 'sort_order' => 9],
            ['name' => '32', 'display_name' => 'Size 32', 'sort_order' => 10],
            ['name' => '34', 'display_name' => 'Size 34', 'sort_order' => 11],
            ['name' => '36', 'display_name' => 'Size 36', 'sort_order' => 12],
            ['name' => '38', 'display_name' => 'Size 38', 'sort_order' => 13],
            ['name' => '40', 'display_name' => 'Size 40', 'sort_order' => 14],
            ['name' => '42', 'display_name' => 'Size 42', 'sort_order' => 15],
        ];

        foreach ($sizes as $size) {
            \App\Models\Size::updateOrCreate(
                ['name' => $size['name']],
                [
                    'display_name' => $size['display_name'],
                    'sort_order' => $size['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
