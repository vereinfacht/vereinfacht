<?php

namespace App\JsonApi\Filters;

use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;

class StatusFilter implements Filter
{
    use DeserializesValue, IsSingular;

    private string $name;
    private string $relationship;
    private string $pivotTable;
    private string $foreignKey;
    private string $relatedKey;
    private string $relatedTable;
    private string $relatedAmountColumn;
    private string $mainAmountColumn;

    public static function make(
        string $name,
        string $relationship,
        string $pivotTable,
        string $foreignKey,
        string $relatedKey,
        string $relatedTable,
        string $relatedAmountColumn = 'amount',
        string $mainAmountColumn = 'amount'
    ): self {
        return new self(
            $name,
            $relationship,
            $pivotTable,
            $foreignKey,
            $relatedKey,
            $relatedTable,
            $relatedAmountColumn,
            $mainAmountColumn
        );
    }

    public function __construct(
        string $name,
        string $relationship,
        string $pivotTable,
        string $foreignKey,
        string $relatedKey,
        string $relatedTable,
        string $relatedAmountColumn = 'amount',
        string $mainAmountColumn = 'amount'
    ) {
        $this->name = $name;
        $this->relationship = $relationship;
        $this->pivotTable = $pivotTable;
        $this->foreignKey = $foreignKey;
        $this->relatedKey = $relatedKey;
        $this->relatedTable = $relatedTable;
        $this->relatedAmountColumn = $relatedAmountColumn;
        $this->mainAmountColumn = $mainAmountColumn;
    }

    public function key(): string
    {
        return $this->name;
    }

    public function apply($query, $value)
    {
        $statuses = $this->deserialize($value);

        if (is_string($statuses) && str_contains($statuses, ',')) {
            $statuses = explode(',', $statuses);
        } elseif (!is_array($statuses)) {
            $statuses = [$statuses];
        }

        $query->where(function (Builder $builder) use ($statuses) {
            $table = $builder->getModel()->getTable();

            foreach ($statuses as $status) {
                $sumQuery = "(SELECT COALESCE(SUM(t.{$this->relatedAmountColumn}),0)
                       FROM {$this->relatedTable} t
                       JOIN {$this->pivotTable} p ON p.{$this->relatedKey} = t.id
                      WHERE p.{$this->foreignKey} = {$table}.id)";

                if ($status === 'completed') {
                    $builder->orWhereRaw("$sumQuery = {$table}.{$this->mainAmountColumn}");
                }

                if ($status === 'pending') {
                    $builder->orWhere(function ($q) use ($sumQuery, $table) {
                        $q->whereRaw("EXISTS (SELECT 1 FROM {$this->pivotTable} p WHERE p.{$this->foreignKey} = {$table}.id)")
                            ->whereRaw("$sumQuery != {$table}.{$this->mainAmountColumn}");
                    });
                }

                if ($status === 'incompleted') {
                    $builder->orDoesntHave($this->relationship);
                }
            }
        });
    }
}
