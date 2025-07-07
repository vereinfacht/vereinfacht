<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\PaymentPeriod;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class PaymentPeriodTest extends TestCase
{
    use DatabaseTransactions;

    public function test_cannot_apply_membership_with_unattached_payment_period(): void
    {
        $club = Club::factory()->create();
        $paymentPeriod = PaymentPeriod::create([
            'rrule' => 'FREQ=MONTHLY;INTERVAL=1',
        ]);
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
                        'id' => (string) $paymentPeriod->getKey(),
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

        $response->assertStatus(422);

        $this->assertDatabaseMissing('memberships', [
            'bank_iban' => $membership->bank_iban,
            'bank_account_holder' => $membership->bank_account_holder,
            'started_at' => $membership->started_at,
            'ended_at' => null,
            'status' => null,
            'membership_type_id' => $membershipType->getKey(),
            'payment_period_id' => $paymentPeriod->getKey(),
            'owner_member_id' => null,
            'club_id' => $club->getKey(),
        ]);
    }
}
