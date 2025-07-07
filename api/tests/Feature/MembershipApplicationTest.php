<?php

namespace Tests\Feature;

use App\Actions\Membership\ApplyMembershipAction;
use App\Enums\MembershipStatusEnum;
use App\Models\Club;
use App\Models\Member;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\User;
use App\Notifications\ApplicationReceived;
use App\Notifications\NewApplication;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class MembershipApplicationTest extends TestCase
{
    use DatabaseTransactions;

    public function test_can_apply_completed_membership()
    {
        $membership = $this->createCompletedMembership();

        (new ApplyMembershipAction)->execute($membership);

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'status' => MembershipStatusEnum::APPLIED,
        ]);
    }

    public function test_cannot_apply_for_membership_if_status_wasnt_null()
    {
        $membership = $this->createCompletedMembership();
        $membership->status = MembershipStatusEnum::ACTIVE;
        $membership->save();

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'status' => MembershipStatusEnum::ACTIVE,
        ]);

        $this->expectExceptionMessage('Membership status must previously been null');

        (new ApplyMembershipAction)->execute($membership);

        $this->assertDatabaseMissing('memberships', [
            'id' => $membership->getKey(),
            'status' => MembershipStatusEnum::APPLIED,
        ]);
    }

    public function test_cannot_apply_for_membership_if_owner_is_missing()
    {
        $membership = $this->createCompletedMembership();
        $membership->owner_member_id = null;
        $membership->save();

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'owner_member_id' => null,
            'status' => null,
        ]);

        $this->expectExceptionMessage('Membership must have an owner');

        (new ApplyMembershipAction)->execute($membership);

        $this->assertDatabaseMissing('memberships', [
            'id' => $membership->getKey(),
            'owner_member_id' => null,
            'status' => MembershipStatusEnum::APPLIED,
        ]);
    }

    public function test_cannot_apply_for_membership_if_members_count_is_above_maximum_members_count()
    {
        $membership = $this->createCompletedMembership();
        Member::factory(2)->create([
            'club_id' => $membership->club->getKey(),
            'membership_id' => $membership->getKey(),
        ]);

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'status' => null,
        ]);

        $this->expectExceptionMessage('Membership must have the correct number of members');

        (new ApplyMembershipAction)->execute($membership);

        $this->assertDatabaseMissing('memberships', [
            'id' => $membership->getKey(),
            'status' => MembershipStatusEnum::APPLIED,
        ]);
    }

    public function test_cannot_apply_for_membership_if_members_count_is_below_minimum_members_count()
    {
        $membership = $this->createCompletedMembership();
        Member::where('membership_id', $membership->getKey())
            ->orderBy('id', 'desc')
            ->limit(2)
            ->delete();

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'status' => null,
        ]);

        $this->expectExceptionMessage('Membership must have the correct number of members');

        (new ApplyMembershipAction)->execute($membership);

        $this->assertDatabaseMissing('memberships', [
            'id' => $membership->getKey(),
            'status' => MembershipStatusEnum::APPLIED,
        ]);
    }

    public function test_club_is_notified_on_membership_application()
    {
        Notification::fake();

        $membership = $this->createCompletedMembership();

        Notification::assertNothingSent();

        (new ApplyMembershipAction)->execute($membership);

        Notification::assertSentTo(
            [$membership->club],
            NewApplication::class
        );
    }

    public function test_all_members_are_notified_on_membership_application()
    {
        Notification::fake();

        $membership = $this->createCompletedMembership();

        Notification::assertNothingSent();

        (new ApplyMembershipAction)->execute($membership);

        Notification::assertSentTo(
            [$membership->members],
            ApplicationReceived::class
        );
    }

    public function test_api_can_apply_for_membership(): void
    {
        $membership = $this->createCompletedMembership();
        setPermissionsTeamId($membership->club);
        $user = User::factory()->create();
        $user->assignRole('super admin');

        $data = [
            'type' => 'memberships',
            'id' => (string) $membership->getKey(),
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('memberships')
            ->withData($data)
            ->post("/api/v1/memberships/{$membership->getKey()}/-actions/apply");

        $response
            ->assertFetchedOne($membership);

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'bank_iban' => $membership->bank_iban,
            'bank_account_holder' => $membership->bank_account_holder,
            'started_at' => $membership->started_at,
            'ended_at' => null,
            'status' => MembershipStatusEnum::APPLIED,
            'membership_type_id' => $membership->membershipType->getKey(),
            'club_id' => $membership->club->getKey(),
        ]);
    }

    protected function createCompletedMembership(): Membership
    {
        $membersCount = 3;
        $club = Club::factory(1)->create()->first();
        $membershipType = MembershipType::factory(1)->create([
            'club_id' => $club->getKey(),
            'minimum_number_of_members' => $membersCount - 1,
            'maximum_number_of_members' => $membersCount + 1,
        ])->first();
        $membership = Membership::factory(1)->create([
            'club_id' => $club->getKey(),
            'owner_member_id' => null,
            'status' => null,
            'membership_type_id' => $membershipType->getKey(),
        ])->first();
        $members = Member::factory($membersCount)->create([
            'club_id' => $club->getKey(),
            'membership_id' => $membership->getKey(),
        ]);
        $membership->owner_member_id = $members->first()->getKey();
        $membership->save();

        $this->assertDatabaseHas('memberships', [
            'id' => $membership->getKey(),
            'owner_member_id' => $members->first()->getKey(),
            'status' => null,
        ]);

        return $membership->refresh();
    }
}
