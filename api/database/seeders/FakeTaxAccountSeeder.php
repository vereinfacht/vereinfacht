<?php

namespace Database\Seeders;

use App\Models\Club;
use Illuminate\Database\Seeder;

class FakeTaxAccountSeeder extends Seeder
{
    public function run(): void
    {
        Club::all()->each(function (Club $club) {
            \App\Models\TaxAccount::factory()->count(5)->create([
                'club_id' => $club->id,
                'tax_account_chart_id' => null,
            ]);
        });
    }
}
