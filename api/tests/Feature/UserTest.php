<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserTest extends TestCase
{
    use DatabaseTransactions;

    private function setupClubAndAdmin(): array
    {
        $club = Club::factory()->create();
        setPermissionsTeamId($club);

        $user = User::factory()->create();
        $user->assignRole('club admin');

        return [$club, $user];
    }

    private function createUserRequestData(Club $club, array $overrides = []): array
    {
        $defaultData = [
            'data' => [
                'type' => 'users',
                'attributes' => [
                    'name' => 'John Doe',
                    'email' => 'john.doe@example.com',
                    'password' => 'securePassword123',
                    'preferredLocale' => 'de'
                ],
                'relationships' => [
                    'club' => [
                        'data' => [
                            'type' => 'clubs',
                            'id' => (string) $club->getKey()
                        ]
                    ],
                    'roles' => [
                        'data' => [
                            [
                                'type' => 'roles',
                                'id' => '3'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        return array_merge_recursive($defaultData, $overrides);
    }

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

    public function test_admin_can_create_new_user_with_roles(): void
    {
        [$club, $user] = $this->setupClubAndAdmin();
        $requestData = $this->createUserRequestData($club);

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('users')
            ->withData($requestData['data'])
            ->post('/api/v1/users');

        $response
            ->assertCreated()
            ->assertJson([
                'data' => [
                    'type' => 'users',
                    'attributes' => [
                        'name' => 'John Doe',
                        'email' => 'john.doe@example.com',
                        'preferredLocale' => 'de'
                    ]
                ]
            ]);

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('users')
            ->includePaths('roles')
            ->get('/api/v1/users/' . $response->json('data.id'));

        $response
            ->assertOk()
            ->assertJson([
                'data' => [
                    'type' => 'users',
                    'id' => $response->json('data.id'),
                    'relationships' => [
                        'roles' => [
                            'data' => [
                                [
                                    'type' => 'roles',
                                    'id' => '3'
                                ]
                            ]
                        ]
                    ]
                ]
            ]);
    }

    public function test_admin_can_update_user_with_roles(): void
    {
        [$club, $user] = $this->setupClubAndAdmin();
        $requestData = $this->createUserRequestData($club);

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('users')
            ->withData($requestData['data'])
            ->post('/api/v1/users');


        $userId = $response->json('data.id');

        $updateRequestData = [
            'data' => [
                'type' => 'users',
                'id' => $userId,
                'attributes' => [
                    'name' => 'Jahne Doe',
                    'email' => 'john.doe@example.com',
                    'preferredLocale' => 'en'
                ],
                'relationships' => [
                    'roles' => [
                        'data' => [
                            [
                                'type' => 'roles',
                                'id' => '2'
                            ]
                        ]
                    ]
                ]
            ]
        ];

        $updateResponse = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('users')
            ->withData($updateRequestData['data'])
            ->patch("/api/v1/users/{$userId}");

        $updateResponse
            ->assertOk()
            ->assertJson([
                'data' => [
                    'type' => 'users',
                    'id' => $userId,
                    'attributes' => [
                        'name' => 'Jahne Doe',
                        'preferredLocale' => 'en'
                    ]
                ]
            ]);

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('users')
            ->includePaths('roles')
            ->get("/api/v1/users/{$userId}");
        $response
            ->assertOk()
            ->assertJson([
                'data' => [
                    'type' => 'users',
                    'id' => $userId,
                    'relationships' => [
                        'roles' => [
                            'data' => [
                                [
                                    'type' => 'roles',
                                    'id' => '2'
                                ]
                            ]
                        ]
                    ]
                ]
            ]);
    }
}
