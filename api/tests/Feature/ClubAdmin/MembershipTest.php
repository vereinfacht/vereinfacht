<?php

namespace Tests\Feature\ClubAdmin;

use App\Models\Club;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MembershipTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_user_can_edit_memberships(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $membership = Membership::factory()->create([
            'club_id' => $club->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $club->getKey(),
            ])->getKey(),
        ]);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'memberships',
            'id' => (string) $membership->getKey(),
            'attributes' => [
                'bankAccountHolder' => 'John Doe',
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->patch("/api/v1/memberships/{$membership->getKey()}");

        $response->assertFetchedOne($membership);

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'bank_account_holder' => 'John Doe',
        ]);
    }

    public function test_admin_user_cannot_edit_other_clubs_memberships(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $membership = Membership::factory()->create([
            'club_id' => $otherClub->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $otherClub->getKey(),
            ])->getKey(),
        ]);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'memberships',
            'id' => (string) $membership->getKey(),
            'attributes' => [
                'bankAccountHolder' => 'John Doe',
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->patch("/api/v1/memberships/{$membership->getKey()}");

        $response->assertStatusCode(404);

        $this->assertDatabaseMissing('memberships', [
            'id' => $membership->getKey(),
            'bank_account_holder' => 'John Doe',
        ]);
    }
}
