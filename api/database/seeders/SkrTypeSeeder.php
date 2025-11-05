<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkrTypeSeeder extends Seeder
{
    public function run(): void
    {
        $skrTypes = [
            ['title' => 'SKR 03', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'SKR 04', 'created_at' => now(), 'updated_at' => now()],
            ['title' => 'SKR 42', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('skr_types')->insert($skrTypes);
    }
}
