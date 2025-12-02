<?php

namespace App\Classes;

use Illuminate\Support\Collection;
use App\Models\Receipt;

class FinancialStatement
{
    /**
     * @param Collection<Receipt> $receipts
     */
    public function __construct(
        protected Collection $receipts,
    ) {
    }

    public function getIncomeExpensesCalculation(): Collection
    {
        $this->receipts = $this->receipts->load('taxAccount')->sortBy('taxAccount.account_number');

        $statement = collect([]);
        $statement->income = collect([]);
        $statement->expenses = collect([]);

        foreach ($this->receipts as $receipt) {
            if ($receipt->tax_account_id === null) {
                continue;
            }

            if ($receipt->amount >= 0) {
                $statement->income->push($this->createStatementItem($receipt));
            } else {
                $statement->expenses->push($this->createStatementItem($receipt));
            }
        }

        $statement->income = $this->getGroupedTaxAccounts($statement->income);
        $statement->expenses = $this->getGroupedTaxAccounts($statement->expenses);

        $statement->totalIncome = $statement->income->sum('amount');
        $statement->totalExpenses = $statement->expenses->sum('amount');

        return $statement;
    }

    protected function createStatementItem(Receipt $receipt): Collection
    {
        return collect([
            'tax_account_id' => $receipt->tax_account_id,
            'account_number' => $receipt->taxAccount->account_number,
            'description' => $receipt->taxAccount->description,
            'amount' => $receipt->amount,
        ]);
    }

    protected function getGroupedTaxAccounts(Collection $items): Collection
    {
        return $items
            ->groupBy(fn($item) => $item['account_number'])
            ->map(function ($items, $accountNumber) {
                return [
                    'tax_account_id' => $items->first()['tax_account_id'],
                    'account_number' => $accountNumber,
                    'description' => $items->first()['description'],
                    'amount' => $items->sum('amount'),
                ];
            })->values();
    }

}
