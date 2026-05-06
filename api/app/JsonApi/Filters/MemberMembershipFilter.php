<?php

namespace App\JsonApi\Filters;

use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;

class MemberMembershipFilter implements Filter
{
    use DeserializesValue;
    use IsSingular;

    private string $name;

    public static function make(string $name = 'membershipId'): self
    {
        return new static($name);
    }

    public function __construct(string $name = 'membershipId')
    {
        $this->name = $name;
    }

    public function key(): string
    {
        return $this->name;
    }

    public function apply($query, $value)
    {
        return $query->where('membership_id', $value);
    }
}
