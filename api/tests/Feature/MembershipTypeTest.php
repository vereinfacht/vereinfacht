<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\MembershipType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MembershipTypeTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_membership_types(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();

        $membershipTypes = MembershipType::factory(3)->create([
            'club_id' => $club->getKey(),
        ]);
        $otherMembershipType = MembershipType::factory()->create([
            'club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('membership-types')
            ->get("/api/v1/clubs/{$club->getKey()}/membership-types");

        $response
            ->assertOk()
            ->assertFetchedMany($membershipTypes)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'membership-types',
                        'id' => $otherMembershipType->getKey(),
                    ],
                ],
            ]);

        $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('membershipTypes')
            ->get("/api/v1/clubs/{$otherClub->getKey()}/membership-types")
            ->assertStatus(404);
    }
}
