<?php

namespace App\JsonApi\Sorting;

use App\Models\Membership;
use LaravelJsonApi\Eloquent\Contracts\SortField;

class MemberStartedAtSort implements SortField
{
    private string $name;

    public static function make(string $name): self
    {
        return new static($name);
    }

    public function __construct(string $name)
    {
        $this->name = $name;
    }

    public function sortField(): string
    {
        return $this->name;
    }

    public function sort($query, string $direction = 'asc')
    {
        $query->orderBy(
            Membership::query()
                ->select('started_at')
                ->whereColumn('memberships.id', 'members.membership_id'),
            $direction,
        );

        return $query;
    }
}
