<?php

namespace Tests\Unit;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\FinanceAccountType;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinanceAccountTest extends TestCase
{
    use DatabaseTransactions;

    public function test_a_finance_account_can_be_created(): void
    {
        $club = Club::factory()->create();
        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'title' => 'Test Account',
        ]);

        $this->assertEquals('Test Account', $financeAccount->title);
        $this->assertEquals($club->id, $financeAccount->club_id);
    }

    public function test_a_finance_account_has_a_finance_account_type(): void
    {
        $club = Club::factory()->create();
        $financeAccountType = FinanceAccountType::factory()->create([
            'title' => 'Test Account Type',
        ]);
        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'finance_account_type_id' => $financeAccountType->id,
        ]);

        $this->assertEquals('Test Account Type', $financeAccount->type->title);
        $this->assertEquals($financeAccountType->id, $financeAccount->type->id);
    }

    public function test_a_finance_account_has_many_transactions(): void
    {
        $club = Club::factory()->create();
        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
        ]);

        Transaction::factory()->count(3)->create([
            'club_id' => $club->id,
            'finance_account_id' => $financeAccount->id,
        ]);

        $this->assertCount(3, $financeAccount->transactions);
    }

    public function test_current_balance_is_calculated_correctly(): void
    {
        $club = Club::factory()->create();
        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'initial_balance' => 10000,
        ]);

        Transaction::factory()->create([
            'finance_account_id' => $financeAccount->id,
            'club_id' => $club->id,
            'amount' => 5000,
        ]);
        Transaction::factory()->create([
            'finance_account_id' => $financeAccount->id,
            'club_id' => $club->id,
            'amount' => -2000,
        ]);

        $this->assertEquals(13000, $financeAccount->getCurrentBalance());
    }
}
