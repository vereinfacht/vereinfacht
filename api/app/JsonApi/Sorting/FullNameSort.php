<?php

namespace App\JsonApi\Sorting;

use LaravelJsonApi\Eloquent\Contracts\SortField;

class FullNameSort implements SortField
{
    private string $name;

    /**
     * Create a new sort field.
     *
     * @param  string|null  $column
     */
    public static function make(string $name): self
    {
        return new static($name);
    }

    /**
     * FullNameSort constructor.
     */
    public function __construct(string $name)
    {
        $this->name = $name;
    }

    /**
     * Get the name of the sort field.
     */
    public function sortField(): string
    {
        return $this->name;
    }

    /**
     * Apply the sort order to the query.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function sort($query, string $direction = 'asc')
    {
        $query->orderByRaw("CONCAT_WS(' ', first_name, last_name) $direction");

        return $query;
    }
}
