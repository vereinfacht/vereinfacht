<?php

namespace Database\Seeders;

use App\Models\FinanceAccountType;
use Illuminate\Database\Seeder;

class FinanceAccountTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FinanceAccountType::create([
            'title' => [
                'de' => 'Bankkonto',
                'en' => 'Bank account',
            ],
        ]);
        FinanceAccountType::create([
            'title' => [
                'de' => 'Kasse',
                'en' => 'Cash box',
            ],
        ]);
    }
}
