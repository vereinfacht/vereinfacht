<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Receipt;
use App\Models\Transaction;
use Illuminate\Database\Seeder;

class FakeTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     */
    public function run(): void
    {
        Club::all()->each(function ($club) {
            $club->statements->each(function ($statement) use ($club) {
                $hasMultiple = rand(1, 100) <= 20;
                $count = $hasMultiple ? rand(2, 15) : 1;

                Transaction::factory()
                    ->count($count)
                    ->make([
                        'statement_id' => $statement->id,
                    ])
                    ->each(function ($transaction) {
                        $transaction->save();
                    });
            });
        });
    }
}
