<?php

namespace App\JsonApi\Filters;

use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;

class MembershipTypeFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    private string $name;

    public static function make(string $name = 'membershipTypeId'): self
    {
        return new static($name);
    }

    public function __construct(string $name = 'membershipTypeId')
    {
        $this->name = $name;
    }

    public function key(): string
    {
        return $this->name;
    }

    public function apply($query, $value)
    {
        return $query->whereHas('membershipTypes', function ($membershipTypes) use ($value) {
            $membershipTypes->where('membership_types.id', $value);
        });
    }
}
