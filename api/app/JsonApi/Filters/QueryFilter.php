<?php

namespace App\JsonApi\Filters;

use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

class QueryFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var array
     */
    private array $columns;

    /**
     * Create a new filter.
     *
     * @param string $name
     * @param array $columns
     * @return QueryFilter
     */
    public static function make(string $name, array $columns = []): self
    {
        return new static($name, $columns);
    }

    /**
     * QueryFilter constructor.
     *
     * @param string $name
     * @param array $columns
     */
    public function __construct(string $name, array $columns = [])
    {
        $this->name = $name;
        $this->columns = $columns;
    }

    /**
     * Get the key for the filter.
     *
     * @return string
     */
    public function key(): string
    {
        return $this->name;
    }

    /**
     * Apply the filter to the query.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param mixed $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply($query, $value)
    {
        if (empty($this->columns)) {
            return $query;
        }

        return $query->where(function ($query) use ($value) {
            foreach ($this->columns as $index => $column) {
                if ($index === 0) {
                    $query->where($column, 'like', "%{$value}%");
                } else {
                    $query->orWhere($column, 'like', "%{$value}%");
                }
            }
        });
    }
}
