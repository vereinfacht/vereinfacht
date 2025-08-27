<?php

namespace App\JsonApi\Filters;

use App\Enums\ReceiptStatusEnum;
use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

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
            if (in_array(ReceiptStatusEnum::INCOMPLETED->value, $statuses, true)) {
                $builder->orDoesntHave('transactions');
            }
            if (in_array(ReceiptStatusEnum::COMPLETED->value, $statuses, true)) {
                $builder->orHas('transactions');
            }
        });
    }
}
