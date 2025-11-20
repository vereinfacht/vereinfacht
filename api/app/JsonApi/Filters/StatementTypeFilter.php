<?php

namespace App\JsonApi\Filters;

use App\Enums\StatementTypeEnum;
use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;

class StatementTypeFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    private string $name;

    public static function make(string $name): self
    {
        return new static($name);
    }

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function key(): string
    {
        return $this->name;
    }

    /**
     * Apply the filter to the query.
     *
     * @param Builder $query
     * @param mixed $value Expected values: 'collective' or 'individual'
     */
    public function apply($query, $value)
    {
        $type = $this->deserialize($value);

        if (!in_array($type, StatementTypeEnum::getAllValues(), true)) {
            return $query;
        }
        if ($type === StatementTypeEnum::COLLECTIVE->value) {
            $query->has('transactions', '>', 1);
        } elseif ($type === StatementTypeEnum::INDIVIDUAL->value) {
            $query->has('transactions', '=', 1);
        }

        return $query;
    }
}
