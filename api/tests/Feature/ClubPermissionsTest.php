<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ClubPermissionsTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_admins_default_club_is_set_in_session_by_middleware(): void
    {
        $user = User::factory()->create();
        Club::factory(3)->create()->each(function ($club) use ($user) {
            setPermissionsTeamId($club);
            $user->assignRole('club admin');
        });

        $defaultClub = $user->getDefaultClub();
        setPermissionsTeamId(null);

        $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->get("/api/v1/clubs/{$defaultClub->getKey()}");

        $this->assertEquals($defaultClub->getKey(), getPermissionsTeamId());
    }

    public function test_club_set_in_session_by_middleware(): void
    {
        $club = Club::factory()->create();

        setPermissionsTeamId(null);

        $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('clubs')
            ->get("/api/v1/clubs/{$club->getKey()}");

        $this->assertEquals($club->getKey(), getPermissionsTeamId());
    }
}
