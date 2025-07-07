<?php

namespace Tests\Unit;

use App\Models\Club;
use App\Models\Division;
use App\Models\Member;
use App\Models\Membership;
use App\Models\MembershipType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MembershipTest extends TestCase
{
    use DatabaseTransactions;

    public function test_membership_monthly_fee_includes_membership_type_fee(): void
    {
        $membershipTypeFee = 10;
        $club = Club::factory(1)->create([
            'allow_voluntary_contribution' => false,
        ])->first();
        $membershipType = MembershipType::factory(1)->create([
            'monthly_fee' => $membershipTypeFee,
            'club_id' => $club->getKey(),
        ])->first();

        $membership = Membership::factory(1)->create([
            'membership_type_id' => $membershipType->getKey(),
            'club_id' => $club->getKey(),
        ])->first();

        $this->assertEquals(
            $membershipTypeFee,
            $membership->getMonthlyFee()
        );
    }

    public function test_membership_monthly_fee_excludes_membership_type_admission_fee(): void
    {
        $membershipTypeFee = 10;
        $membershipTypeAdmissionFee = 5;
        $club = Club::factory(1)->create([
            'allow_voluntary_contribution' => false,
        ])->first();
        $membershipType = MembershipType::factory(1)->create([
            'monthly_fee' => $membershipTypeFee,
            'admission_fee' => $membershipTypeAdmissionFee,
            'club_id' => $club->getKey(),
        ])->first();

        $membership = Membership::factory(1)->create([
            'membership_type_id' => $membershipType->getKey(),
            'club_id' => $club->getKey(),
        ])->first();

        $this->assertEquals(
            $membershipTypeFee,
            $membership->getMonthlyFee()
        );

        $this->assertNotEquals(
            $membershipTypeFee + $membershipTypeAdmissionFee,
            $membership->getMonthlyFee()
        );
    }

    public function test_membership_monthly_fee_includes_voluntary_contribution(): void
    {
        $membershipTypeFee = 10;
        $voluntaryContribution = 5;
        $club = Club::factory(1)->create([
            'allow_voluntary_contribution' => true,
        ])->first();
        $membershipType = MembershipType::factory(1)->create([
            'monthly_fee' => $membershipTypeFee,
            'club_id' => $club->getKey(),
        ])->first();

        $membership = Membership::factory(1)->create([
            'membership_type_id' => $membershipType->getKey(),
            'club_id' => $club->getKey(),
            'voluntary_contribution' => $voluntaryContribution,
        ])->first();

        $this->assertEquals(
            $membershipTypeFee + $voluntaryContribution,
            $membership->getMonthlyFee()
        );
    }

    public function test_membership_monthly_fee_includes_selected_divisions(): void
    {
        $membershipTypeFee = 10;
        $divisionFees = [
            2,
            7.5,
            null,
            0,
        ];
        $memberCount = 2;

        $club = Club::factory(1)->create([
            'allow_voluntary_contribution' => false,
        ])->first();
        $membershipType = MembershipType::factory(1)->create([
            'monthly_fee' => $membershipTypeFee,
            'club_id' => $club->getKey(),
        ])->first();
        $divisions = Division::factory(count($divisionFees))->create([
            'club_id' => $club->getKey(),
        ])->pluck('id');
        $membershipType->divisions()
            ->attach(
                $divisions->mapWithKeys(
                    fn ($division, $index) => [$division => ['monthly_fee' => $divisionFees[$index]]]
                )
            );
        $membership = Membership::factory(1)->create([
            'membership_type_id' => $membershipType->getKey(),
            'club_id' => $club->getKey(),
        ])->first();

        Member::factory($memberCount)->create([
            'membership_id' => $membership->getKey(),
            'club_id' => $club->getKey(),
        ])->map(fn ($member) => $member->divisions()->attach($divisions));

        $this->assertEquals(
            $membershipTypeFee + (array_sum($divisionFees) * $memberCount),
            $membership->getMonthlyFee()
        );
    }
}
