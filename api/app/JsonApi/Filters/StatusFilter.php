<?php

namespace App\JsonApi\Filters;

use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

class StatusFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    private string $name;
    private ?string $column = null;
    private ?string $relationship = null;
    private ?array $statusMap = null;

    /**
     * Create a new filter instance.
     */
    public static function make(
        string $name,
        ?string $column = null,
        ?string $relationship = null,
        ?array $statusMap = null
    ): self {
        return new static($name, $column, $relationship, $statusMap);
    }

    public function __construct(
        string $name,
        ?string $column = null,
        ?string $relationship = null,
        ?array $statusMap = null
    ) {
        $this->name = $name;
        $this->column = $column;
        $this->relationship = $relationship;
        $this->statusMap = $statusMap;
    }

    public function key(): string
    {
        return $this->name;
    }

    public function apply($query, $value)
    {
        $statuses = $this->deserialize($value);
        if (!is_array($statuses)) {
            $statuses = [$statuses];
        }

        if ($this->relationship && $this->statusMap) {
            $query->where(function (Builder $builder) use ($statuses) {
                foreach ($statuses as $status) {
                    $condition = $this->statusMap[$status] ?? null;
                    if ($condition === 'has') {
                        $builder->orHas($this->relationship);
                    } elseif ($condition === 'doesnt_have') {
                        $builder->orDoesntHave($this->relationship);
                    }
                }
            });
        } elseif ($this->column) {
            $query->whereIn($this->column, $statuses);
        }
    }
}
