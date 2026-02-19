<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class FakeStatementSeeder extends Seeder
{
    public function run(): void
    {
        Club::all()->each(function ($club) {
            $club->financeAccounts->each(function ($account) {
                $this->createIndividualStatements($account, 20);
                $this->createCollectiveStatements($account, 2);
                $this->createCollectiveStatements($account, 2, false);
            });
        });
    }
    protected function createIndividualStatements(FinanceAccount $account, int $count): void
    {
        $individualStatements = Statement::factory()
            ->count($count)
            ->create([
                'club_id' => $account->club_id,
                'finance_account_id' => $account->id,
                'statement_type' => 'individual',
            ]);

        $individualStatements->each(function ($statement) {
            Transaction::factory()
                ->create([
                    'booked_at' => $statement->date,
                    'valued_at' => $statement->date,
                    'statement_id' => $statement->id,
                ]);
        });
    }

    protected function createCollectiveStatements(FinanceAccount $account, int $count, bool $income = true): void
    {
        if ($account->account_type !== 'bank_account') {
            return;
        }

        $collectiveStatements = Statement::factory()
            ->count($count)
            ->create([
                'club_id' => $account->club_id,
                'finance_account_id' => $account->id,
                'statement_type' => 'collective',
            ]);

        $collectiveStatements->each(function ($statement) use ($income) {
            Transaction::factory()
                ->count(rand(2, 35))
                ->create([
                    'title' => $income ? 'Sammellastschrift' : 'Sammelüberweisung',
                    'booked_at' => $statement->date,
                    'valued_at' => $statement->date,
                    'amount' => rand(500, 2000) / 100 * ($income ? 1 : -1),
                    'statement_id' => $statement->id,
                ]);
        });
    }
}

