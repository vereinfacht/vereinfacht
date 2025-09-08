<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_transactions()
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
            ->get('/api/v1/transactions')
            ->assertOk()
            ->assertFetchedMany($transactions);
    }
}
