<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'email' => 'hello@vereinfacht.digital',
        ]);
    }
}
