<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TaxAccountChartSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            ['title' => 'SKR 03', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('tax_account_charts')->insert($data);
    }
}
