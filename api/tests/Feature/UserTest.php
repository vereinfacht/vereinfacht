<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_users(): void
    {
        $otherClub = Club::factory()->create();
        $otherUser = User::factory()->create();

        setPermissionsTeamId($otherClub);
        $otherUser->assignRole('club admin');

        $club = Club::factory()->create();
        setPermissionsTeamId($club);

        // for some reason the application crashes, when assigning roles within
        // a collections each() callback.
        for ($i = 0; $i < 2; $i++) {
            User::factory()->create([
                'name' => 'user1'
            ])->assignRole('club admin');
        }
        $users = User::where('name', 'user1')->get();

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('users')
            ->get('/api/v1/users');

        $response
            ->assertOk()
            ->assertFetchedMany($users)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'users',
                        'id' => $otherUser->getKey(),
                    ],
                ],
            ]);
    }
}
