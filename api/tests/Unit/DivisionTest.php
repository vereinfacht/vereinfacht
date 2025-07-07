<?php

namespace Tests\Unit;

use App\Models\Club;
use App\Models\Division;
use App\Models\MembershipType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DivisionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_division_can_have_many_membership_types(): void
    {
        $club = Club::factory()->create();
        $division = Division::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $membershipTypes = MembershipType::factory(2)->create([
            'club_id' => $club->getKey(),
        ]);

        $division->membershipTypes()->attach($membershipTypes);
        $this->assertEquals(
            $membershipTypes->pluck('id'),
            $division->membershipTypes->pluck('id')
        );
    }

    public function test_division_membership_type_can_have_monthly_fee(): void
    {
        $club = Club::factory()->create();
        $division = Division::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $membershipType = MembershipType::factory()->create([
            'club_id' => $club->getKey(),
        ]);

        $division->membershipTypes()->attach($membershipType, ['monthly_fee' => 1]);
        $this->assertDatabaseHas('division_membership_type', [
            'division_id' => $division->getKey(),
            'membership_type_id' => $membershipType->getKey(),
            'monthly_fee' => 100,
        ]);
    }
}
