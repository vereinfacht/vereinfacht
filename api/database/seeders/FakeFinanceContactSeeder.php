<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\FinanceContact;
use Illuminate\Database\Seeder;

class FakeFinanceContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Club::all()->each(function ($club) {
            FinanceContact::factory()->count(20)->create([
                'club_id' => $club->id,
            ]);
            FinanceContact::factory()->count(20)->company()->create([
                'club_id' => $club->id,
            ]);
        });
    }
}
