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
            $receipts = Receipt::factory()
                ->count(50)
                ->create([
                    'club_id' => $club->id,
                ]);

            $transactions = Transaction::where('club_id', $club->id)->get();

            // Attach random transactions to each receipt
            $receipts->each(function ($receipt) use ($transactions) {
                $receipt->transactions()->attach(
                    $transactions->random(rand(1, 3))->pluck('id')->toArray()
                );
            });
        });
    }
}
