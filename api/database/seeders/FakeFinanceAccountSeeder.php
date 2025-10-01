<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\FinanceAccount;
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
                    Transaction::factory()->count(30)->state([
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
                    Transaction::factory()->count(30)->state([
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
