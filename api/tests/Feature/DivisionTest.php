<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\Division;
use App\Models\Member;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DivisionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_divisions(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $divisions = Division::factory(3)->create([
            'club_id' => $club->getKey(),
        ]);
        $otherDivision = Division::factory()->create([
            'club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('divisions')
            ->get("/api/v1/clubs/{$club->getKey()}/divisions");

        $response
            ->assertOk()
            ->assertFetchedMany($divisions)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'divisions',
                        'id' => $otherDivision->getKey(),
                    ],
                ],
            ]);

        $responseIndex = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('divisions')
            ->get('/api/v1/divisions');

        $responseIndex
            ->assertOk()
            ->assertFetchedMany($divisions)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'divisions',
                        'id' => $otherDivision->getKey(),
                    ],
                ],
            ]);
    }

    public function test_club_can_attach_member_to_division_of_own_club(): void
    {
        $club = Club::factory()->create();
        $divisions = Division::factory(2)->create([
            'club_id' => $club->getKey(),
        ]);
        $existingDivision = Division::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $membershipType = MembershipType::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $member = Member::factory()->create([
            'club_id' => $club->getKey(),
            'membership_id' => Membership::factory()->create([
                'club_id' => $club->getKey(),
                'membership_type_id' => $membershipType->getKey(),
            ])->getKey(),
        ]);
        $membershipType->divisions()->attach($club->divisions()->get('id'));
        $member
            ->divisions()
            ->attach($existingDivision);

        $data = [
            [
                'type' => 'divisions',
                'id' => (string) $divisions->first()->getKey(),
            ],
            [
                'type' => 'divisions',
                'id' => (string) $divisions->last()->getKey(),
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('divisions')
            ->withData($data)
            ->post("/api/v1/members/{$member->getKey()}/relationships/divisions");

        $response->assertNoContent();

        /** The existing division should still be attached. */
        $this->assertDatabaseHas('division_member', [
            'division_id' => $existingDivision->getKey(),
            'member_id' => $member->getKey(),
        ]);

        /** These divisions should have been attached. */
        foreach ($divisions as $division) {
            $this->assertDatabaseHas('division_member', [
                'division_id' => $division->getKey(),
                'member_id' => $member->getKey(),
            ]);
        }
    }

    public function test_admin_user_can_only_get_current_clubs_divisions(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $divisions = Division::factory(3)->create([
            'club_id' => $club->getKey(),
        ]);
        $otherDivision = Division::factory()->create([
            'club_id' => $otherClub->getKey(),
        ]);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('divisions')
            ->get('/api/v1/divisions');

        $response
            ->assertOk()
            ->assertFetchedMany($divisions)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'divisions',
                        'id' => $otherDivision->getKey(),
                    ],
                ],
            ]);
    }
}
