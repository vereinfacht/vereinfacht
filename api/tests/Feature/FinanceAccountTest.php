<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinanceAccountTest extends TestCase
{
    use DatabaseTransactions;

    public function test_api_can_get_finance_accounts_for_club()
    {
        $club = Club::factory()->create();

        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id
        ]);

        $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('finance-accounts')
            ->get('/api/v1/finance-accounts')
            ->assertOk()
            ->assertFetchedMany([$financeAccount]);
    }

    public function test_api_can_get_transactions_for_a_finance_account()
    {
        $club = Club::factory()->create();

        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id
        ]);
        $transactions = Transaction::factory()->count(3)->create([
            'club_id' => $club->id,
            'finance_account_id' => $financeAccount->id,
        ]);

        $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('transactions')
            ->get("/api/v1/finance-accounts/{$financeAccount->getKey()}/transactions")
            ->assertOk()
            ->assertFetchedMany($transactions);
    }
}
