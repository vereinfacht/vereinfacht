<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Receipt;
use App\Models\Transaction;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;

class FakeReceiptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        Club::all()->each(function ($club) use ($faker) {
            $receipts = Receipt::factory()
                ->count(50)
                ->create([
                    'club_id' => $club->id,
                ]);

            $transactions = Transaction::where('club_id', $club->id)->get();
            $receipts->each(function ($receipt) use ($transactions, $faker) {
                if ($faker->boolean(80)) {
                    $receipt->transactions()->attach(
                        $transactions->random(rand(1, 3))->pluck('id')->toArray()
                    );
                }
            });
        });
    }
}
