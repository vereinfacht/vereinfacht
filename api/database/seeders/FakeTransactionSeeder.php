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
     */
    public function run(): void
    {
        Club::all()->each(function ($club) {
            $club->statements->each(function ($statement) use ($club) {
                Transaction::factory()
                    ->count(rand(5, 15))
                    ->make([
                        'statement_id' => $statement->id,
                    ])
                    ->each(function ($transaction) use ($club) {
                        $transaction->save();
                    });
            });
        });
    }
}
