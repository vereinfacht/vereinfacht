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
                'hasConsentedMediaPublication' => true,
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
            ->assertCreatedWithServerId(config('app.url') . '/api/v1/members', $data)
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
                'hasConsentedMediaPublication' => true,
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
            ->assertCreatedWithServerId(config('app.url') . '/api/v1/members', $data)
            ->id();

        $this->assertDatabaseHas('members', [
            'id' => $id,
            'consented_media_publication_at' => now(),
        ]);
    }

    public function test_cannot_create_member_when_membership_has_no_capacity(): void
    {
        $club = Club::factory()->create();
        $membershipType = MembershipType::factory()->create([
            'club_id' => $club->getKey(),
            'minimum_number_of_members' => 1,
            'maximum_number_of_members' => 1,
        ]);
        $membership = Membership::factory()->create([
            'club_id' => $club->getKey(),
            'membership_type_id' => $membershipType->getKey(),
        ]);

        Member::factory()->create([
            'club_id' => $club->getKey(),
            'membership_id' => $membership->getKey(),
        ]);

        $member = Member::factory()->make();

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
                'hasConsentedMediaPublication' => true,
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

        $response
            ->assertStatus(422)
            ->assertJsonFragment([
                'detail' => __('validation.custom.membership.maximum_members_reached'),
            ]);

        $this->assertDatabaseMissing('members', [
            'first_name' => $member->first_name,
            'last_name' => $member->last_name,
            'email' => $member->email,
            'club_id' => $club->getKey(),
        ]);
    }

    public function test_cannot_update_member_to_membership_with_no_capacity(): void
    {
        $club = Club::factory()->create();

        $availableMembership = Membership::factory()->create([
            'club_id' => $club->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $club->getKey(),
                'minimum_number_of_members' => 1,
                'maximum_number_of_members' => 5,
            ])->getKey(),
        ]);

        $fullMembership = Membership::factory()->create([
            'club_id' => $club->getKey(),
            'membership_type_id' => MembershipType::factory()->create([
                'club_id' => $club->getKey(),
                'minimum_number_of_members' => 1,
                'maximum_number_of_members' => 1,
            ])->getKey(),
        ]);

        Member::factory()->create([
            'club_id' => $club->getKey(),
            'membership_id' => $fullMembership->getKey(),
        ]);

        $memberToUpdate = Member::factory()->create([
            'club_id' => $club->getKey(),
            'membership_id' => $availableMembership->getKey(),
        ]);

        $data = [
            'type' => 'members',
            'id' => (string) $memberToUpdate->getKey(),
            'attributes' => [
                'firstName' => $memberToUpdate->first_name,
                'lastName' => $memberToUpdate->last_name,
                'gender' => $memberToUpdate->gender,
                'address' => $memberToUpdate->address,
                'zipCode' => $memberToUpdate->zip_code,
                'city' => $memberToUpdate->city,
                'country' => $memberToUpdate->country,
                'birthday' => $memberToUpdate->birthday,
                'phoneNumber' => $memberToUpdate->phone_number,
                'email' => $memberToUpdate->email,
                'hasConsentedMediaPublication' => true,
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
                        'id' => (string) $fullMembership->getKey(),
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
            ->patch("/api/v1/members/{$memberToUpdate->getKey()}");

        $response
            ->assertStatus(422)
            ->assertJsonFragment([
                'detail' => __('validation.custom.membership.maximum_members_reached'),
            ]);

        $this->assertDatabaseHas('members', [
            'id' => $memberToUpdate->getKey(),
            'membership_id' => $availableMembership->getKey(),
        ]);
    }
}
