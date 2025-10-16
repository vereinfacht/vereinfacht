<?php

namespace App\Actions\Transaction;

use App\Models\FinanceAccount;
use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Jejik\MT940\Reader;

class FileImport
{
    public function execute(FinanceAccount $financeAccount): array
    {
        $reader = new Reader();
        $statements = $reader->getStatements(File::get(storage_path('app/mta-gls.mta')));
        $action = [
            'total_statements_created' => 0,
            'total_transactions_created' => 0,
        ];

        foreach ($statements as $parsedStatement) {
            // @todo: also convert currency to EUR and save using current exchange rate

            // @todo: check for existing statements by identifier, value etc before creating new statements and transactions

            $currency = Arr::get($parsedStatement->getClosingBalance(), 'currency', 'EUR');
            $statement = Statement::create([
                'identifier' => $parsedStatement->getAccount()->getNumber() ?? '',
                'date' => $parsedStatement->getClosingBalance()->getDate() ?? now(),
                'finance_account_id' => $financeAccount->id,
                'club_id' => $financeAccount->club_id,
            ]);
            $action['total_statements_created']++;

            foreach ($parsedStatement->getTransactions() as $transaction) {
                $date = $transaction->getValueDate() ?? $transaction->getBookDate();
                Transaction::create([
                    'name' => $transaction->getAccountHolder() ?? $date ?? 'Unknown',
                    'description' => $transaction->getSvwz(),
                    'amount' => $transaction->getAmount(),
                    'currency' => $currency,
                    'statement_id' => $statement->id,
                    'valued_at' => $transaction->getValueDate(),
                    'booked_at' => $transaction->getBookDate(),
                ]);
                $action['total_transactions_created']++;
            }

        }

        return $action;
    }
}
