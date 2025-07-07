<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\FinanceAccountType;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinanceAccountTest extends TestCase
{
    use DatabaseTransactions;

    public function test_api_can_get_finance_accounts_for_club()
    {
        $club = Club::factory()->create();
        $type = FinanceAccountType::factory()->create([
            'title' => [
                'en' => 'Sparkasse en',
                'de' => 'Sparkasse de',
            ],
        ]);

        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'finance_account_type_id' => $type->id,
            'title' => 'Sparkassen Konto',
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
            ->get("/api/v1/finance-accounts/{$financeAccount->getKey()}/transactions")
            ->assertOk()
            ->assertFetchedMany($transactions);
    }
}
