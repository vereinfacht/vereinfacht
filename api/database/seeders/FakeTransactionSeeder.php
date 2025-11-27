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
                $statementType = 'individual';

                if ($statement->financeAccount->account_type === 'bank_account') {
                    if (rand(0, 100) > 75) {
                        $count = rand(0, 1) ? 1 : rand(2, 35);
                        $statementType = 'collective';
                    } else {
                        $count = 1;
                    }
                } else {
                    $count = 1;
                }

                Transaction::factory()
                    ->count($count)
                    ->create([
                        'statement_id' => $statement->id,
                    ]);

                $statement->statement_type = $statementType;
                $statement->identifier = \App\Classes\StatementIdentifierGenerator::generate(
                    $statement->date,
                    $statement->transactions()->sum('amount'),
                    $statement->identifier
                );
                $statement->save();
            });
        });
    }
}
