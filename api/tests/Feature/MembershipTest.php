<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\Member;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\PaymentPeriod;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class MembershipTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_create_new_membership(): void
    {
        $this->createMembership();
    }

    public function test_club_can_create_new_membership_with_payment_period(): void
    {
        $club = Club::factory()->create();
        $club->paymentPeriods()->attach(PaymentPeriod::create([
            'rrule' => 'FREQ=MONTHLY;INTERVAL=1',
        ]));
        $membershipType = MembershipType::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $membership = Membership::factory()->make();

        $data = [
            'type' => 'memberships',
            'attributes' => [
                'bankIban' => $membership->bank_iban,
                'bankAccountHolder' => $membership->bank_account_holder,
                'startedAt' => $membership->started_at,
            ],
            'relationships' => [
                'membershipType' => [
                    'data' => [
                        'type' => 'membership-types',
                        'id' => (string) $membershipType->getKey(),
                    ],
                ],
                'paymentPeriod' => [
                    'data' => [
                        'type' => 'payment-periods',
                        'id' => (string) $club->paymentPeriods()->first()->getKey(),
                    ],
                ],
                'club' => [
                    'data' => [
                        'type' => 'clubs',
                        'id' => (string) $club->getKey(),
                    ],
                ],
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->includePaths('membershipType', 'club', 'paymentPeriod')
            ->post('/api/v1/memberships');

        $id = $response
            ->assertCreatedWithServerId(config('app.url').'/api/v1/memberships', $data)
            ->id();

        $this->assertDatabaseHas('memberships', [
            'id' => $id,
            'bank_iban' => $membership->bank_iban,
            'bank_account_holder' => $membership->bank_account_holder,
            'started_at' => $membership->started_at,
            'ended_at' => null,
            'status' => null,
            'membership_type_id' => $membershipType->getKey(),
            'payment_period_id' => $club->paymentPeriods()->first()->getKey(),
            'owner_member_id' => null,
            'club_id' => $club->getKey(),
        ]);
    }

    public function test_club_can_set_owner(): void
    {
        $membershipId = $this->createMembership();
        $membership = Membership::with('club', 'membershipType')->find($membershipId);
        $club = $membership->club;
        $owner = Member::factory()->create([
            'club_id' => $club->getKey(),
            'membership_id' => $membership->getKey(),
        ])->first();

        $data = [
            'type' => 'memberships',
            'id' => (string) $membership->getKey(),
            'relationships' => [
                'owner' => [
                    'data' => [
                        'type' => 'members',
                        'id' => (string) $owner->getKey(),
                    ],
                ],
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->includePaths('owner')
            ->patch("/api/v1/memberships/{$membership->getKey()}");

        $response->assertStatus('200');

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'owner_member_id' => $owner->getKey(),
        ]);
    }

    public function test_club_cannot_update_memberships_for_other_club(): void
    {
        $membershipId = $this->createMembership();
        $membership = Membership::with('club', 'membershipType')->find($membershipId);
        $club = $membership->club;
        $owner = Member::factory()->create([
            'club_id' => $club->getKey(),
            'membership_id' => $membership->getKey(),
        ]);

        $data = [
            'type' => 'memberships',
            'id' => (string) $membership->getKey(),
            'relationships' => [
                'owner' => [
                    'data' => [
                        'type' => 'members',
                        'id' => (string) $owner->getKey(),
                    ],
                ],
            ],
        ];

        $otherClub = Club::factory()->create();

        $response = $this
            ->actingAs($otherClub)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->includePaths('owner')
            ->patch("/api/v1/memberships/{$membership->getKey()}");

        $response->assertStatus(404);

        $this->assertDatabaseMissing('memberships', [
            'id' => $membership->getKey(),
            'owner_member_id' => $owner->getKey(),
        ]);
    }

    public function test_club_cannot_create_membership_for_other_club()
    {
        $club = Club::factory()->create();
        $membershipType = MembershipType::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $membership = Membership::factory()->make();

        $data = [
            'type' => 'memberships',
            'attributes' => [
                'bankIban' => $membership->bank_iban,
                'bankAccountHolder' => $membership->bank_account_holder,
                'startedAt' => $membership->started_at,
            ],
            'relationships' => [
                'membershipType' => [
                    'data' => [
                        'type' => 'membership-types',
                        'id' => (string) $membershipType->getKey(),
                    ],
                ],
                'club' => [
                    'data' => [
                        'type' => 'clubs',
                        'id' => (string) $club->getKey(),
                    ],
                ],
            ],
        ];

        $otherClub = Club::factory()->create();

        $response = $this
            ->actingAs($otherClub)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->includePaths('membershipType', 'club')
            ->post('/api/v1/memberships');

        $response->assertStatus(404);

        $this->assertDatabaseMissing('memberships', [
            'bank_iban' => $membership->bank_iban,
            'bank_account_holder' => $membership->bank_account_holder,
            'started_at' => $membership->started_at,
            'ended_at' => null,
            'status' => null,
            'membership_type_id' => $membershipType->getKey(),
            'owner_member_id' => null,
            'club_id' => $club->getKey(),
        ]);
    }

    protected function createMembership(): int
    {
        $club = Club::factory()->create();
        $membershipType = MembershipType::factory()->create([
            'club_id' => $club->getKey(),
        ]);
        $membership = Membership::factory()->make();

        $data = [
            'type' => 'memberships',
            'attributes' => [
                'bankIban' => $membership->bank_iban,
                'bankAccountHolder' => $membership->bank_account_holder,
                'startedAt' => $membership->started_at,
                'voluntaryContribution' => 10.1,
            ],
            'relationships' => [
                'membershipType' => [
                    'data' => [
                        'type' => 'membership-types',
                        'id' => (string) $membershipType->getKey(),
                    ],
                ],
                'club' => [
                    'data' => [
                        'type' => 'clubs',
                        'id' => (string) $club->getKey(),
                    ],
                ],
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->includePaths('membershipType', 'club')
            ->post('/api/v1/memberships');

        $id = $response
            ->assertCreatedWithServerId(config('app.url').'/api/v1/memberships', $data)
            ->id();

        $this->assertDatabaseHas('memberships', [
            'id' => $id,
            'bank_iban' => $membership->bank_iban,
            'bank_account_holder' => $membership->bank_account_holder,
            'started_at' => $membership->started_at,
            'ended_at' => null,
            'status' => null,
            'membership_type_id' => $membershipType->getKey(),
            'voluntary_contribution' => 1010,
            'owner_member_id' => null,
            'club_id' => $club->getKey(),
        ]);

        return $id;
    }
}
