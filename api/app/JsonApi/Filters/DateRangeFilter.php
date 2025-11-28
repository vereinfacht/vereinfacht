<?php

namespace App\JsonApi\Filters;

use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

class DateRangeFilter implements Filter
{
    use DeserializesValue, IsSingular;

    private string $name;
    private string $column;

    public static function make(string $name, ?string $column = null): self
    {
        return new static($name, $column);
    }

    public function __construct(string $name, ?string $column = null)
    {
        $this->name = $name;
        $this->column = $column ?: $name;
    }

    public function key(): string
    {
        return $this->name;
    }

    public function apply($query, $value)
    {
        if (!is_array($value)) {
            return $query;
        }

        $startDate = $value['from'] ?? null;
        $endDate = $value['to'] ?? null;

        if ($startDate && $endDate) {
            return $query->whereBetween($this->column, [$startDate, $endDate]);
        }

        if ($startDate) {
            return $query->where($this->column, '>=', $startDate);
        }

        if ($endDate) {
            return $query->where($this->column, '<=', $endDate);
        }

        return $query;
    }
}
