<?php

namespace Tests\Feature\ClubAdmin;

use App\Models\Club;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MembershipTypeTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_user_can_edit_membership_types(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $membership = Membership::factory()->create([
            'club_id' => $club->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $club->getKey(),
                'monthly_fee' => 100,
                'admission_fee' => 300,
                'minimum_number_of_months' => 4,
                'minimum_number_of_members' => 1,
                'maximum_number_of_members' => 3,
            ])->getKey(),
        ]);
        $membershipType = $membership->membershipType;

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'membership-types',
            'id' => (string) $membershipType->getKey(),
            'attributes' => [
                'titleTranslations' => [
                    'xx' => 'New Danish title',
                ],
                'descriptionTranslations' => [
                    'xx' => 'New Danish Description',
                ],
                'monthlyFee' => 2,
                'admissionFee' => 4,
                'minimumNumberOfMonths' => 6,
                'minimumNumberOfMembers' => 2,
                'maximumNumberOfMembers' => 5,
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('membership-types')
            ->withData($data)
            ->patch("/api/v1/membership-types/{$membershipType->getKey()}");

        $response->assertFetchedOne($membershipType);

        $this->assertDatabaseHas(
            'membership_types',
            [
                'id' => $membershipType->getKey(),
                'title' => json_encode(
                    array_merge(
                        $membershipType->getTranslations('title'),
                        $data['attributes']['titleTranslations']
                    )
                ),
                'description' => json_encode(
                    array_merge(
                        $membershipType->getTranslations('description'),
                        $data['attributes']['descriptionTranslations']
                    )
                ),
                'monthly_fee' => 200,
                'admission_fee' => 400,
                'minimum_number_of_months' => 6,
                'minimum_number_of_members' => 2,
                'maximum_number_of_members' => 5,
            ]
        );
    }

    public function test_admin_user_cannot_edit_other_clubs_membership_types(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $membership = Membership::factory()->create([
            'club_id' => $otherClub->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $otherClub->getKey(),
                'monthly_fee' => 100,
            ])->getKey(),
        ]);
        $membershipType = $membership->membershipType;

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'membership-types',
            'id' => (string) $membershipType->getKey(),
            'attributes' => [
                'monthlyFee' => 200,
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('membership-types')
            ->withData($data)
            ->patch("/api/v1/membership-types/{$membershipType->getKey()}");

        $response->assertStatusCode(404);

        $this->assertDatabaseMissing('membership_types', [
            'id' => $membershipType->getKey(),
            'monthly_fee' => 200,
        ]);
    }
}
