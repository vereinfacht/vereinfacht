<?php

namespace Tests\Feature\ClubAdmin;

use App\Models\ActivityLog;
use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ActivityLogTest extends TestCase
{
    use DatabaseTransactions;

    public function test_updating_a_club_records_an_activity_log_with_old_and_new_values(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create(['title' => 'Old title']);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->withData([
                'type' => 'clubs',
                'id' => (string) $club->getRouteKey(),
                'attributes' => [
                    'title' => 'New title',
                ],
            ])
            ->patch("/api/v1/clubs/{$club->getKey()}");

        $response->assertSuccessful();

        $activityLog = ActivityLog::query()
            ->where('subject_type', Club::class)
            ->where('subject_id', $club->getKey())
            ->where('event', 'updated')
            ->latest('id')
            ->first();

        $this->assertNotNull($activityLog);
        $this->assertSame('Old title', $activityLog->properties['old']['title']);
        $this->assertSame('New title', $activityLog->properties['attributes']['title']);
        $this->assertTrue($activityLog->causer->is($user));
    }

    public function test_admin_user_can_list_activity_logs_of_own_club(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create(['title' => 'Old title']);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $club->update(['title' => 'New title']);

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('activity-logs')
            ->get('/api/v1/activity-logs?filter[subjectType]=clubs&filter[subjectId]='.$club->getKey().'&sort=-createdAt');

        $response->assertSuccessful();

        $updateLog = collect($response->json('data'))
            ->firstWhere('attributes.event', 'updated');

        $this->assertNotNull($updateLog);
        $this->assertSame('clubs', $updateLog['attributes']['subjectType']);
        $this->assertEquals($club->getKey(), $updateLog['attributes']['subjectId']);
        $this->assertSame('Old title', $updateLog['attributes']['properties']['old']['title']);
        $this->assertSame('New title', $updateLog['attributes']['properties']['attributes']['title']);
    }

    public function test_admin_user_cannot_list_activity_logs_of_other_clubs(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create(['title' => 'Other old title']);

        $otherClub->update(['title' => 'Other new title']);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('activity-logs')
            ->get('/api/v1/activity-logs');

        $response->assertSuccessful();

        $subjectIds = collect($response->json('data'))
            ->map(fn (array $log) => [
                $log['attributes']['subjectType'],
                (int) $log['attributes']['subjectId'],
            ]);

        $this->assertFalse($subjectIds->contains(['clubs', (int) $otherClub->getKey()]));
    }

    public function test_user_without_permission_cannot_list_activity_logs(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();

        setPermissionsTeamId($club);

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('activity-logs')
            ->get('/api/v1/activity-logs');

        $response->assertStatusCode(403);
    }
}
