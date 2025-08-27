<?php

namespace App\JsonApi\Filters;

use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;

class StatusFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    /**
     * @var string
     */
    private string $name;

    /**
     * @var string
     */
    private string $column;

    /**
     * Create a new filter.
     *
     * @param string $name
     * @return StatusFilter
     */
    public static function make(string $name): self
    {
        return new static($name);
    }

    /**
     * StatusFilter constructor.
     *
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name = $name;
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
        $statuses = $this->deserialize($value);

        if (!is_array($statuses)) {
            $statuses = [$statuses];
        }

        $query->where(function (Builder $builder) use ($statuses) {
            if (in_array('open', $statuses, true)) {
                $builder->orDoesntHave('transactions');
            }
            if (in_array('completed', $statuses, true)) {
                $builder->orHas('transactions');
            }
        });
    }
}
