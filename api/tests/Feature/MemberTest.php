<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\Member;
use App\Models\Membership;
use App\Models\MembershipType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MemberTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_create_new_member(): void
    {
        $club = Club::factory()->create();
        $member = Member::factory()->make();
        $membership = Membership::factory()->create([
            'club_id' => $club->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $club->getKey(),
            ])->getKey(),
        ]);

        $data = [
            'type' => 'members',
            'attributes' => [
                'firstName' => $member->first_name,
                'lastName' => $member->last_name,
                'gender' => $member->gender,
                'address' => $member->address,
                'zipCode' => $member->zip_code,
                'city' => $member->city,
                'country' => $member->country,
                'birthday' => $member->birthday,
                'phoneNumber' => $member->phone_number,
                'email' => $member->email,
            ],
            'relationships' => [
                'club' => [
                    'data' => [
                        'type' => 'clubs',
                        'id' => (string) $club->getKey(),
                    ],
                ],
                'membership' => [
                    'data' => [
                        'type' => 'memberships',
                        'id' => (string) $membership->getKey(),
                    ],
                ],
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('members')
            ->withData($data)
            ->includePaths('membership', 'club')
            ->post('/api/v1/members');

        $id = $response
            ->assertCreatedWithServerId(config('app.url').'/api/v1/members', $data)
            ->id();

        $this->assertDatabaseHas('members', [
            'id' => $id,
            'first_name' => $member->first_name,
            'last_name' => $member->last_name,
            'gender' => $member->gender,
            'address' => $member->address,
            'zip_code' => $member->zip_code,
            'city' => $member->city,
            'country' => $member->country,
            'birthday' => $member->birthday,
            'phone_number' => $member->phone_number,
            'email' => $member->email,
            'club_id' => $club->getKey(),
        ]);
    }

    public function test_cannot_create_member_for_other_club()
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $member = Member::factory()->make();
        $membership = Membership::factory()->create([
            'club_id' => $otherClub->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $otherClub->getKey(),
            ])->getKey(),
        ]);

        $data = [
            'type' => 'members',
            'attributes' => [
                'firstName' => $member->first_name,
                'lastName' => $member->last_name,
                'gender' => $member->gender,
                'address' => $member->address,
                'zipCode' => $member->zip_code,
                'city' => $member->city,
                'country' => $member->country,
                'birthday' => $member->birthday,
                'phoneNumber' => $member->phone_number,
                'email' => $member->email,
            ],
            'relationships' => [
                'club' => [
                    'data' => [
                        'type' => 'clubs',
                        'id' => (string) $otherClub->getKey(),
                    ],
                ],
                'membership' => [
                    'data' => [
                        'type' => 'memberships',
                        'id' => (string) $membership->getKey(),
                    ],
                ],
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('members')
            ->withData($data)
            ->includePaths('membership', 'club')
            ->post('/api/v1/members');

        // due to the ClubScope, the related club and membership resources are filtered
        // out and therefore do not exist from the current user's perspective.
        // This applies to many other tests, too.
        $response->assertError(404, [
            'status' => '404',
            'detail' => 'The related resource does not exist.',
        ]);

        $this->assertDatabaseMissing('members', [
            'first_name' => $member->first_name,
            'last_name' => $member->last_name,
            'gender' => $member->gender,
            'address' => $member->address,
            'zip_code' => $member->zip_code,
            'city' => $member->city,
            'country' => $member->country,
            'birthday' => $member->birthday,
            'phone_number' => $member->phone_number,
            'email' => $member->email,
            'club_id' => $otherClub->getKey(),
        ]);
    }

    public function test_consent_boolean_mutates_timestamp_column()
    {
        $club = Club::factory()->create();
        $membership = Membership::factory()->create([
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $club->getKey(),
            ])->getKey(),
            'club_id' => $club->getKey(),
        ]);
        $member = Member::factory()->make([
            'consented_media_publication_at' => null,
        ]);

        $data = [
            'type' => 'members',
            'attributes' => [
                'firstName' => $member->first_name,
                'lastName' => $member->last_name,
                'gender' => $member->gender,
                'address' => $member->address,
                'zipCode' => $member->zip_code,
                'city' => $member->city,
                'country' => $member->country,
                'birthday' => $member->birthday,
                'email' => $member->email,
                'hasConsentedMediaPublication' => true,
            ],
            'relationships' => [
                'membership' => [
                    'data' => [
                        'type' => 'memberships',
                        'id' => (string) $membership->getKey(),
                    ],
                ],
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('members')
            ->withData($data)
            ->includePaths('membership')
            ->post('/api/v1/members');

        $id = $response
            ->assertCreatedWithServerId(config('app.url').'/api/v1/members', $data)
            ->id();

        $this->assertDatabaseHas('members', [
            'id' => $id,
            'consented_media_publication_at' => now(),
        ]);
    }
}
