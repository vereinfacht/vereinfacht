<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class FakeDatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DatabaseSeeder::class,
            TaxAccountChartSeeder::class,
            DemoClubSeeder::class,
            FakeClubsSeeder::class,
            FakeFinanceAccountSeeder::class,
            FakeFinanceContactSeeder::class,
            FakeTransactionSeeder::class,
            TaxAccountSeeder::class,
            FakeTaxAccountSeeder::class,
            FakeReceiptSeeder::class,
        ]);
    }
}
