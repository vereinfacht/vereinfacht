<?php

namespace App\JsonApi\Sorting;

use LaravelJsonApi\Eloquent\Contracts\SortField;

class ReceiptAmountSort implements SortField
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
        $query->orderByRaw("CASE WHEN receipt_type = 'expense' THEN -amount ELSE amount END $direction");

        return $query;
    }
}
