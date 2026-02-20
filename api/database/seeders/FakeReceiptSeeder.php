<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\FinanceContact;
use App\Models\Receipt;
use App\Models\Statement;
use App\Models\TaxAccount;
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
            $this->withoutTransactions($club->id, 10);
            $this->withExactTransaction($club->id, 10);
            $this->withSomeTransactions($club->id, 10);
        });

        $this->attachRelationships();

        // @todo: fix seeding in remote environments
        if (app()->environment('local')) {
            $this->attachMedia();
        }
    }

    protected function withoutTransactions(int $club_id, int $count): void
    {
        Receipt::factory()
            ->count($count)
            ->create(['club_id' => $club_id, 'booking_date' => now()->subDays(rand(1, 30))]);
    }

    protected function withExactTransaction(int $club_id, int $count): void
    {
        $receipts = Receipt::factory()
            ->count($count)
            ->create(['club_id' => $club_id]);

        $receipts->each(function ($receipt) use ($club_id) {
            $statement = Statement::factory()
                ->create([
                    'statement_type' => 'individual',
                    'club_id' => $club_id,
                    'finance_account_id' => FinanceAccount::where('club_id', $club_id)->inRandomOrder()->first()->id,
                ]);

            Transaction::factory()
                ->create([
                    'amount' => $receipt->amount,
                    'receipt_id' => $receipt->id,
                    'statement_id' => $statement->id,
                    'booked_at' => $statement->date,
                    'valued_at' => $statement->date,
                ]);
        });
    }

    protected function withSomeTransactions(int $club_id, int $count): void
    {
        $receipts = Receipt::factory()
            ->count($count)
            ->create(['club_id' => $club_id]);

        $receipts->each(function ($receipt) use ($club_id) {
            $statement = Statement::factory()
                ->create([
                    'statement_type' => 'individual',
                    'club_id' => $club_id,
                    'finance_account_id' => FinanceAccount::where('club_id', $club_id)->inRandomOrder()->first()->id,
                ]);

            Transaction::factory()
                ->create([
                    'amount' => $receipt->amount,
                    'receipt_id' => $receipt->id,
                    'statement_id' => $statement->id,
                    'booked_at' => $statement->date,
                    'valued_at' => $statement->date,
                ]);
        });
    }

    protected function attachMedia(): void
    {
        $seedFiles = [
            storage_path('app/seed/receipt-test.pdf'),
            storage_path('app/seed/receipt-test.png'),
        ];

        Receipt::all()->each(function ($receipt) use ($seedFiles) {
            if (rand(1, 100) <= 50) {
                foreach (range(1, rand(1, 3)) as $i) {
                    $filePath = $seedFiles[array_rand($seedFiles)];
                    $receipt->addMedia($filePath)
                        ->withProperties(['club_id' => $receipt->club_id])
                        ->preservingOriginal()
                        ->toMediaCollection('receipts', 'public');
                }
            }
        });
    }

    protected function attachRelationships(): void
    {
        Receipt::all()->each(function ($receipt) {
            if (rand(1, 100) <= 50) {
                $receipt->financeContact()->associate(FinanceContact::where('club_id', $receipt->club_id)->inRandomOrder()->first());
            }

            if (rand(1, 100) <= 50) {
                $receipt->taxAccount()->associate(TaxAccount::where('club_id', $receipt->club_id)->inRandomOrder()->first());
            }

            $receipt->save();
        });
    }
}
