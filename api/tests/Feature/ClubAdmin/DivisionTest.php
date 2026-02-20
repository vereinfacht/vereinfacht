<?php

namespace Tests\Feature\ClubAdmin;

use App\Models\Club;
use App\Models\Division;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class DivisionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_user_can_edit_divisions(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $division = Division::factory()->create([
            'club_id' => $club->getKey(),
        ]);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'divisions',
            'id' => (string) $division->getKey(),
            'attributes' => [
                'titleTranslations' => [
                    'de' => 'New German title',
                ],
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('divisions')
            ->withData($data)
            ->patch("/api/v1/divisions/{$division->getKey()}");

        $response->assertFetchedOne($division);

        $this->assertDatabaseHas('divisions', [
            'id' => $division->getKey(),
            'title' => json_encode(
                array_merge(
                    $division->getTranslations('title'),
                    $data['attributes']['titleTranslations']
                )
            ),
        ]);
    }

    public function test_admin_user_cannot_edit_other_clubs_divisions(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $division = Division::factory()->create([
            'club_id' => $otherClub->getKey(),
        ]);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'divisions',
            'id' => (string) $division->getKey(),
            'attributes' => [
                'titleTranslations' => [
                    'de' => 'New German title',
                ],
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('divisions')
            ->withData($data)
            ->patch("/api/v1/divisions/{$division->getKey()}");

        $response->assertStatusCode(404);

        $this->assertDatabaseMissing('divisions', [
            'id' => $division->getKey(),
            'title' => json_encode(
                array_merge(
                    $division->getTranslations('title'),
                    $data['attributes']['titleTranslations']
                )
            ),
        ]);
    }
}
