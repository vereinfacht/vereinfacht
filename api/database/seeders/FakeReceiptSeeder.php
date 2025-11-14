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
            $receipts = Receipt::factory()
                ->count(20)
                ->create(['club_id' => $club->id]);

            // Attach media
            $receipts->each(function ($receipt) use ($seedFiles, $club) {
                if (rand(1, 100) <= 50) {
                    foreach (range(1, rand(1, 3)) as $i) {
                        $filePath = $seedFiles[array_rand($seedFiles)];
                        $receipt->addMedia($filePath)
                            ->withProperties(['club_id' => $club->id])
                            ->preservingOriginal()
                            ->toMediaCollection('receipts', 'public');
                    }
                }
            });

            // Attach transactions
            $transactions = Transaction::whereHas('statement', fn($query) => $query->where('club_id', $club->id))->get();

            $noTransactionReceipts = $receipts->random(max(1, floor($receipts->count() * 0.3)));
            $unusedTransactions = $transactions->random(max(1, floor($transactions->count() * 0.2)));
            $usableTransactions = $transactions->diff($unusedTransactions);

            $receipts->each(function ($receipt) use ($usableTransactions, $noTransactionReceipts) {
                if ($noTransactionReceipts->contains($receipt)) {
                    return;
                }

                $selectedTransaction = $usableTransactions->random(1)->first();
                if ($selectedTransaction) {
                    $selectedTransaction->receipt_id = $receipt->id;
                    $selectedTransaction->save();

                    $usableTransactions = $usableTransactions->reject(function ($transaction) use ($selectedTransaction) {
                        return $transaction->id === $selectedTransaction->id;
                    });

                    $receipt->amount = rand(1, 100) <= 50
                        ? $selectedTransaction->amount
                        : $selectedTransaction->amount * (1 + (rand(10, 30) / 100) * (rand(0, 1) ? 1 : -1));

                    $receipt->save();
                }
            });
        });
    }
}
