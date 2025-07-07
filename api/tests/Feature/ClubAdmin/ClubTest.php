<?php

namespace Tests\Feature\ClubAdmin;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class ClubTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_user_can_get_own_club(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->get("/api/v1/clubs/{$club->getKey()}");

        $response->assertSuccessful();
    }

    public function test_admin_user_cannot_get_other_clubs(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->get("/api/v1/clubs/{$otherClub->getKey()}");

        $response->assertStatusCode(404);
    }

    public function test_admin_user_can_edit_own_club(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'clubs',
            'id' => (string) $club->getRouteKey(),
            'attributes' => [
                'title' => 'New title',
                'extendedTitle' => 'New extended title',
                'address' => 'New address',
                'zipCode' => 'New zip code',
                'city' => 'New city',
                'country' => 'New country',
                'email' => 'newemail@example.org',
                'websiteUrl' => 'https://new.example.org',
                'logoUrl' => 'https://new.example.org/logo.png',
                'privacyStatementUrl' => 'https://new.example.org/privacy',
                'contributionStatementUrl' => 'https://new.example.org/contribution',
                'constitutionUrl' => 'https://new.example.org/constitution',
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->withData($data)
            ->patch("/api/v1/clubs/{$club->getKey()}");

        $response->assertFetchedOne($club);

        $this->assertDatabaseHas('clubs', [
            'id' => $club->getKey(),
            'title' => $data['attributes']['title'],
            'extended_title' => $data['attributes']['extendedTitle'],
            'address' => $data['attributes']['address'],
            'zip_code' => $data['attributes']['zipCode'],
            'city' => $data['attributes']['city'],
            'country' => $data['attributes']['country'],
            'email' => $data['attributes']['email'],
            'website_url' => $data['attributes']['websiteUrl'],
            'logo_url' => $data['attributes']['logoUrl'],
            'privacy_statement_url' => $data['attributes']['privacyStatementUrl'],
            'contribution_statement_url' => $data['attributes']['contributionStatementUrl'],
            'constitution_url' => $data['attributes']['constitutionUrl'],
        ]);
    }

    public function test_admin_user_cannot_edit_other_club(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'clubs',
            'id' => (string) $otherClub->getRouteKey(),
            'attributes' => [
                'title' => 'New title',
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->withData($data)
            ->patch("/api/v1/clubs/{$otherClub->getKey()}");

        $response->assertStatusCode(404);

        $this->assertDatabaseMissing('clubs', [
            'id' => $otherClub->getKey(),
            'title' => $data['attributes']['title'],
        ]);
    }

    public function test_admin_user_cannot_edit_any_field_of_own_club(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $originalValue = $club->slug;

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'clubs',
            'id' => (string) $club->getRouteKey(),
            'attributes' => [
                'slug' => 'new-attribute-value',
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('clubs')
            ->withData($data)
            ->patch("/api/v1/clubs/{$club->getKey()}");

        $response->assertFetchedOne($club);

        $this->assertDatabaseMissing('clubs', [
            'id' => $club->getKey(),
            'extended_title' => $data['attributes']['slug'],
        ]);

        $this->assertDatabaseHas('clubs', [
            'id' => $club->getKey(),
            'slug' => $originalValue,
        ]);
    }
}
