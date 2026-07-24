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
    public function test_forgot_password_sends_resetnotification(): void
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
                'password' => 'password',
                'password_confirmation' => 'password',

            ]);

        $response->assertStatus(200);

        $this->assertTrue(
            Hash::check(
                'password',
                $user->fresh()->password,
            )
        );
    }
}
