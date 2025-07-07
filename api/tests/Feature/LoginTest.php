<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use DatabaseTransactions;

    public function test_successful_login_attempt_returns_token(): void
    {
        $password = 'password';
        $user = User::factory()->create([
            'password' => bcrypt($password),
        ]);
        $club = Club::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->post('/api/v1/users/login', [
                'email' => $user->email,
                'password' => $password,
            ]);

        $response->assertStatus(200);

        $this->assertTrue(
            filled($response->json()['meta']['token'])
        );
    }

    public function test_login_requires_club_role_association(): void
    {
        $password = 'password';
        $user = User::factory()->create([
            'password' => bcrypt($password),
        ]);

        $response = $this
            ->post('/api/v1/users/login', [
                'email' => $user->email,
                'password' => $password,
            ]);

        $response->assertStatus(422);

        $club = Club::factory()->create();
        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $response = $this
            ->post('/api/v1/users/login', [
                'email' => $user->email,
                'password' => $password,
            ]);

        $response->assertStatus(200);
    }
}
