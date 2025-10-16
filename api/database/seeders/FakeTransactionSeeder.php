<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class FakeTransactionSeeder extends Seeder
{
    public function run(): void
    {
        Club::with('statements.financeAccount')->get()->each(function ($club) {
            $club->statements->each(function ($statement) {

                if ($statement->financeAccount->account_type === 'bank_account') {
                    $count = rand(1, 100) <= 40 ? rand(2, 15) : 1;
                } else {
                    $count = 1;
                }

                Transaction::factory()
                    ->count($count)
                    ->create([
                        'statement_id' => $statement->id,
                    ]);
            });
        });
    }
}
