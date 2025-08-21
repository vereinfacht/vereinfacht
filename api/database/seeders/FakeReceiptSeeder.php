<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Receipt;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class FakeReceiptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Club::all()->each(function ($club) {
            Receipt::factory()->count(50)->create([
                'club_id' => $club->id,
                'transaction_id' => Transaction::factory()->create()->id,
            ]);
        });
    }
}
