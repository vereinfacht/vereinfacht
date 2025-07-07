<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'email' => 'hello@vereinfacht.digital',
        ]);

        $user->tokens()->create([
            'name' => 'Super Admin Token',
            'token' => 'f20d1cea0f72c03b09e85c51d27c238ef1258f37c5ee0967ad3b611c02e28222',
            'abilities' => ['*'],
            'expires_at' => null,
        ]);
    }
}
