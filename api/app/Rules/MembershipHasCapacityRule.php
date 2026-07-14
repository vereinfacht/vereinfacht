<?php

namespace App\Rules;

use App\Models\Membership;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Ensures selected membership has not reached maximum number of members.
 */
class MembershipHasCapacityRule implements ValidationRule
{
    public function __construct(private readonly ?int $ignoreMemberId = null)
    {
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (blank($value)) {
            return;
        }

        $membership = Membership::find($value);

        if (! $membership) {
            return;
        }

        if (! $membership->hasCapacity($this->ignoreMemberId)) {
            $fail(__('validation.custom.membership.maximum_members_reached'));
        }
    }
}