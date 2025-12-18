<?php

namespace App\JsonApi\Sorting;

use LaravelJsonApi\Eloquent\Contracts\SortField;

class TransactionAmountSort implements SortField
{
    private string $name;

    public static function make(string $name): self
    {
        return new static($name);
    }

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function sortField(): string
    {
        return $this->name;
    }

    public function sort($query, string $direction = 'asc')
    {
        $query->withSum('transactions', 'amount')
            ->orderBy('transactions_sum_amount', $direction);

        return $query;
    }

}
