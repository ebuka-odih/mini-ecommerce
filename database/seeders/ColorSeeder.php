<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['name' => 'Black', 'hex_code' => '#000000', 'display_name' => 'Black', 'sort_order' => 1],
            ['name' => 'White', 'hex_code' => '#FFFFFF', 'display_name' => 'White', 'sort_order' => 2],
            ['name' => 'Red', 'hex_code' => '#FF0000', 'display_name' => 'Red', 'sort_order' => 3],
            ['name' => 'Blue', 'hex_code' => '#0000FF', 'display_name' => 'Blue', 'sort_order' => 4],
            ['name' => 'Green', 'hex_code' => '#008000', 'display_name' => 'Green', 'sort_order' => 5],
            ['name' => 'Yellow', 'hex_code' => '#FFFF00', 'display_name' => 'Yellow', 'sort_order' => 6],
            ['name' => 'Orange', 'hex_code' => '#FFA500', 'display_name' => 'Orange', 'sort_order' => 7],
            ['name' => 'Purple', 'hex_code' => '#800080', 'display_name' => 'Purple', 'sort_order' => 8],
            ['name' => 'Pink', 'hex_code' => '#FFC0CB', 'display_name' => 'Pink', 'sort_order' => 9],
            ['name' => 'Brown', 'hex_code' => '#A52A2A', 'display_name' => 'Brown', 'sort_order' => 10],
            ['name' => 'Gray', 'hex_code' => '#808080', 'display_name' => 'Gray', 'sort_order' => 11],
            ['name' => 'Navy', 'hex_code' => '#000080', 'display_name' => 'Navy Blue', 'sort_order' => 12],
            ['name' => 'Maroon', 'hex_code' => '#800000', 'display_name' => 'Maroon', 'sort_order' => 13],
            ['name' => 'Olive', 'hex_code' => '#808000', 'display_name' => 'Olive Green', 'sort_order' => 14],
            ['name' => 'Cream', 'hex_code' => '#F5F5DC', 'display_name' => 'Cream', 'sort_order' => 15],
            ['name' => 'Beige', 'hex_code' => '#F5F5DC', 'display_name' => 'Beige', 'sort_order' => 16],
            ['name' => 'Khaki', 'hex_code' => '#F0E68C', 'display_name' => 'Khaki', 'sort_order' => 17],
            ['name' => 'Denim', 'hex_code' => '#1E3A8A', 'display_name' => 'Denim Blue', 'sort_order' => 18],
        ];

        foreach ($colors as $color) {
            \App\Models\Color::updateOrCreate(
                ['name' => $color['name']],
                [
                    'hex_code' => $color['hex_code'],
                    'display_name' => $color['display_name'],
                    'sort_order' => $color['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}
