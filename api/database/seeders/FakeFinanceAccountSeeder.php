<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\FinanceAccount;
use Illuminate\Database\Seeder;

class FakeFinanceAccountSeeder extends Seeder
{
    public function run(): void
    {
        Club::all()->each(function ($club) {
            FinanceAccount::factory()
                ->create([
                    'title' => 'Sparkasse Beiträge',
                    'club_id' => $club->id,
                    'account_type' => 'bank_account'
                ]);

            FinanceAccount::factory()
                ->create([
                    'title' => 'Vereinsheim',
                    'club_id' => $club->id,
                    'account_type' => 'cash_box',
                    'initial_balance' => 1000
                ]);
        });
    }
}