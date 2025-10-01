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
        $seedFiles = [
            storage_path('app/seed/receipt-test.pdf'),
            storage_path('app/seed/receipt-test.png'),
        ];

        Club::all()->each(function ($club) use ($seedFiles) {
            $financeContacts = $club->financeContacts;
            $receipts = Receipt::factory()
                ->count(20)
                ->make(['club_id' => $club->id])
                ->each(function ($receipt) use ($financeContacts, $seedFiles) {
                    if (rand(1, 100) <= 70 && $financeContacts->count() > 0) {
                        $receipt->finance_contact_id = $financeContacts->random()->id;
                    }
                    $receipt->save();

                    $count = rand(1, 3);
                    // 50% chance to have media
                    if (rand(1, 100) <= 50) {
                        $count = rand(1, 3);
                        for ($i = 1; $i <= $count; $i++) {
                            $filePath = $seedFiles[array_rand($seedFiles)];

                            $receipt->addMedia($filePath)
                                ->preservingOriginal()
                                ->toMediaCollection('receipts', 'public');
                        }
                    }
                });

            $transactions = Transaction::where('club_id', $club->id)->get();
            $noTransactionReceipts = $receipts->random(max(1, floor($receipts->count() * 0.3)));
            $unusedTransactions = $transactions->random(max(1, floor($transactions->count() * 0.2)));
            $usableTransactions = $transactions->diff($unusedTransactions);

            $receipts->each(function ($receipt) use ($usableTransactions, $noTransactionReceipts) {
                if ($noTransactionReceipts->contains($receipt)) {
                    return;
                }

                $receipt->transactions()->attach(
                    $usableTransactions->random(rand(1, 3))->pluck('id')->toArray()
                );
            });
        });
    }
}
