<?php

namespace App\JsonApi\Filters;

use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

class WithoutRelationFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    /**
     * The API filter key.
     */
    private string $name;

    /**
     * The relation to check for.
     */
    private string $relation;

    /**
     * Create a new filter instance.
     *
     * @param string $name
     * @param string $relation
     */
    public function __construct(string $name, string $relation)
    {
        $this->name = $name;
        $this->relation = $relation;
    }

    /**
     * Factory method for convenience.
     *
     * @param string $name
     * @param string $relation
     * @return static
     */
    public static function make(string $name, string $relation): self
    {
        return new self($name, $relation);
    }

    /**
     * Get the filter key used in the API request.
     */
    public function key(): string
    {
        return $this->name;
    }

    /**
     * Apply the filter to the query.
     *
     * @param Builder $query
     * @param mixed $value
     * @return Builder
     */
    public function apply($query, $value): Builder
    {
        if (!$value) {
            return $query;
        }

        return $query->doesntHave($this->relation);
    }
}
