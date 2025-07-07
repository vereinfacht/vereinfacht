<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Str;
use Tests\TestCase;

class ClubTest extends TestCase
{
    use DatabaseTransactions;

    public function test_clubs_generate_slugs_automatically_on_create(): void
    {
        $club = Club::factory()->create();

        $this->assertNotNull($club->slug);
        $this->assertEquals(Str::slug($club->title), $club->slug);
    }

    public function test_can_manually_set_club_slug(): void
    {
        $club = Club::factory()->create([
            'slug' => 'my-club',
        ]);

        $this->assertEquals('my-club', $club->slug);
    }

    public function test_super_admin_can_get_clubs(): void
    {
        $user = User::factory()->create();
        $clubs = Club::factory(3)->create()->each(function ($club) use ($user) {
            setPermissionsTeamId($club);
            $user->assignRole('super admin');
        });

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->get('/api/v1/clubs');

        $response->assertOk();
        $response->assertFetchedMany($clubs);
    }

    public function test_super_admin_can_get_clubs_filtered_by_slug(): void
    {
        $user = User::factory()->create();
        $clubs = Club::factory(3)->create()->each(function ($club) use ($user) {
            setPermissionsTeamId($club);
            $user->assignRole('super admin');
        });
        $firstClub = $clubs->first();

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->filter(['slug' => $firstClub->slug])
            ->get('/api/v1/clubs');

        $response->assertOk();
        $response->assertFetchedMany([$firstClub]);
    }

    public function test_other_user_cannot_get_clubs(): void
    {
        Club::factory(3)->create();
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->get('/api/v1/clubs');

        $response->assertForbidden();
    }
}
