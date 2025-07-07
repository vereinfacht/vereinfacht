<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\FinanceAccountType;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use DatabaseTransactions;

    public function test_api_can_get_transactions_of_a_club()
    {
        $club = Club::factory()->create();
        $financeAccountType = FinanceAccountType::factory()->create([
            'title' => [
                'en' => 'Test Account Type',
                'de' => 'Test Account Type',
            ],
        ]);

        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'finance_account_type_id' => $financeAccountType->id,
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
