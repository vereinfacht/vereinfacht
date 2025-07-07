<?php

namespace Tests\Unit;

use App\Models\Club;
use App\Models\Division;
use App\Models\MembershipType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MembershipTypeTest extends TestCase
{
    use DatabaseTransactions;

    public function test_membership_type_can_have_many_divisions(): void
    {
        $club = Club::factory(1)->create()->first();
        $membershipType = MembershipType::factory(1)->create([
            'club_id' => $club->getKey(),
        ])->first();
        $divisions = Division::factory(2)->create([
            'club_id' => $club->getKey(),
        ]);

        $membershipType->divisions()->attach($divisions);
        $this->assertEquals($divisions->pluck('id'), $membershipType->divisions->pluck('id'));
    }
}
