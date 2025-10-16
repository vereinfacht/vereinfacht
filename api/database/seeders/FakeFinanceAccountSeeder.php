<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Statement;
use App\Models\FinanceAccount;
use Illuminate\Database\Seeder;

class FakeFinanceAccountSeeder extends Seeder
{
    public function run(): void
    {
        Club::all()->each(function ($club) {
            FinanceAccount::factory()
                ->has(
                    Statement::factory()->count(30)
                        ->state(fn(array $attributes, FinanceAccount $account) => [
                            'club_id' => $club->id,
                            'finance_account_id' => $account->id,
                        ])
                )
                ->create([
                    'title' => 'Sparkasse Beiträge',
                    'club_id' => $club->id,
                    'account_type' => 'bank_account'
                ]);

            FinanceAccount::factory()
                ->has(
                    Statement::factory()->count(30)
                        ->state(fn(array $attributes, FinanceAccount $account) => [
                            'club_id' => $club->id,
                            'finance_account_id' => $account->id,
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
