<?php

namespace App\JsonApi\Filters;

use App\Models\Membership;
use LaravelJsonApi\Eloquent\Contracts\Filter;
use LaravelJsonApi\Eloquent\Filters\Concerns\DeserializesValue;
use LaravelJsonApi\Eloquent\Filters\Concerns\IsSingular;

class MembershipFilter implements Filter
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
        $membershipTypeId = Membership::query()->find($value)?->membership_type_id;

        if (!$membershipTypeId) {
            return $query->whereRaw('1 = 0');
        }

        return $query->whereHas('membershipTypes', function ($membershipTypes) use ($membershipTypeId) {
            $membershipTypes->where('membership_types.id', $membershipTypeId);
        });
    }
}
