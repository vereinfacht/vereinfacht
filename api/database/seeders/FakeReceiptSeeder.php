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
            $noTransactionReceipts = $receipts->random(max(1, floor($receipts->count() * 0.3)));

            $receipts->each(function ($receipt) use ($transactions, $noTransactionReceipts) {
                if ($noTransactionReceipts->contains($receipt)) {
                    return;
                }

                $receipt->transactions()->attach(
                    $transactions->random(rand(1, 3))->pluck('id')->toArray()
                );
            });
        });
    }
}
