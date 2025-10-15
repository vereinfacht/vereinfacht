<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class FakeFinanceAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Club::all()->each(function ($club) {
            FinanceAccount::factory()
                ->has(
                    Statement::factory()->count(30)->state([
                        'club_id' => $club->id,
                    ])
                )
                ->create([
                    'title' => 'Sparkasse Beiträge',
                    'club_id' => $club->id,
                    'account_type' => 'bank_account'
                ]);
            FinanceAccount::factory()
                ->has(
                    Statement::factory()->count(30)->state([
                        'club_id' => $club->id,
                    ])
                )
                ->create([
                    'title' => 'Vereinsheim',
                    'club_id' => $club->id,
                    'account_type' => 'cash_box',
                    'initial_balance' => 1000
                ]);
        });
    }
}
