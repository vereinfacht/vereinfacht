<?php

namespace App\Actions\Membership;

use App\Enums\MembershipStatusEnum;
use App\Events\AppliedForMembership;
use App\Models\Membership;
use ErrorException;

class ApplyMembershipAction
{
    public function execute(Membership $membership): void
    {
        $this->validateMembershipForApplication($membership);

        $membership->status = MembershipStatusEnum::APPLIED;
        $membership->save();

        AppliedForMembership::dispatch($membership);

    }

    private function validateMembershipForApplication(Membership $membership)
    {
        if (filled($membership->status)) {
            throw new ErrorException('Membership status must previously been null');
        }

        if (! $membership->owner()->exists()) {
            throw new ErrorException('Membership must have an owner');
        }

        if (! $this->hasAllowedMembersCount($membership)) {
            throw new ErrorException('Membership must have the correct number of members');
        }
    }

    private function hasAllowedMembersCount(Membership $membership): bool
    {
        if ($membership->members()->count() < $membership->membershipType?->minimum_number_of_members) {
            return false;
        }

        if ($membership->members()->count() > $membership->membershipType?->maximum_number_of_members) {
            return false;
        }

        return true;
    }
}
