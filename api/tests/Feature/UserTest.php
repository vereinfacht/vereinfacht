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
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $user = User::factory(2)->create([
            'current_club_id' => $club->getKey(),
        ]);
        $otherUser = User::factory()->create([
            'current_club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('users')
            ->get("/api/v1/users");

        $response
            ->assertOk()
            ->assertFetchedMany($user)
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
