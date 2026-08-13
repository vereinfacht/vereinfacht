<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    public function test_forgot_password_sends_reset_notification(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this
            ->post('/api/v1/users/forgot-password', [
                'email' => $user->email,
            ]);

        $response->assertStatus(200);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_forgot_password_with_non_existing_email_returns_generic_error(): void
    {
        $response = $this
            ->post('/api/v1/users/forgot-password', [
                'email' => 'non_existing_email@example.com',
            ]);

        $response->assertStatus(200);

        $response->assertJson([
            'message' => 'If an account with that email address exists, we\'ve sent a link to reset the password.'
        ]);
    }

    public function test_forgot_password_fails_when_reaches_rate_limiting(): void
    {
        $rateLimit = 5;

        for ($i = 0; $i < $rateLimit; $i++) {
            $this->post('/api/v1/users/forgot-password', [
                'email' => 'spam@example.com',
            ]);
        }

        $response = $this->post('/api/v1/users/forgot-password', [
            'email' => 'spam@example.com',
        ]);

        $response->assertStatus(429);
    }

    public function test_reset_password_updates_database(): void
    {
        $password = 'password_old';

        $user = User::factory()->create([
            'password' => bcrypt($password),
        ]);

        $token = Password::createToken($user);

        $response = $this
            ->post('/api/v1/users/reset-password', [
                'token' => $token,
                'email' => $user->email,
                'password' => 'StrongP@ssw0rd1',
                'password_confirmation' => 'StrongP@ssw0rd1',

            ]);

        $response->assertStatus(200);

        $this->assertTrue(
            Hash::check(
                'StrongP@ssw0rd1',
                $user->fresh()->password,
            )
        );
    }

    public function test_reset_password_fails_with_invalid_token(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->post('/api/v1/users/reset-password', [
                'token' => "invalid_token",
                'email' => $user->email,
                'password' => 'StrongP@ssw0rd1',
                'password_confirmation' => 'StrongP@ssw0rd1',
            ]);

        $response->assertStatus(422);
    }

    public function test_reset_password_fails_with_expired_token(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);
        $this->travel(config('auth.passwords.users.expire') + 1)->minutes();

        $response = $this
            ->post('/api/v1/users/reset-password', [
                'token' => $token,
                'email' => $user->email,
                'password' => 'StrongP@ssw0rd1',
                'password_confirmation' => 'StrongP@ssw0rd1',
            ]);

        $response->assertStatus(422);
    }
}
