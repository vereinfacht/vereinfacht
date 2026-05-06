<?php

namespace App\JsonApi\Filters;

use Illuminate\Database\Eloquent\Builder;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;

class MembershipQueryFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    private string $name;

    public static function make(string $name = 'query'): self
    {
        return new static($name);
    }

    public function __construct(string $name = 'query')
    {
        $this->name = $name;
    }

    public function key(): string
    {
        return $this->name;
    }

    public function apply($query, $value)
    {
        $value = trim((string) $value);

        if ($value === '') {
            return $query;
        }

        return $query->where(function (Builder $query) use ($value) {
            $query->where('bank_account_holder', 'like', "%{$value}%")
                ->orWhereHas('owner', function (Builder $ownerQuery) use ($value) {
                    $ownerQuery->where('first_name', 'like', "%{$value}%")
                        ->orWhere('last_name', 'like', "%{$value}%");
                });
        });
    }
}
