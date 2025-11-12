<?php

namespace Tests\Unit;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\Statement;
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

    public function test_a_finance_account_has_many_statements(): void
    {
        $club = Club::factory()->create();
        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
        ]);

        Statement::factory()->count(3)->create([
            'club_id' => $club->id,
            'finance_account_id' => $financeAccount->id,
        ]);

        $this->assertCount(3, $financeAccount->statements);
    }

    public function test_current_balance_is_calculated_correctly(): void
    {
        $club = Club::factory()->create();
        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'initial_balance' => 10000,
        ]);

        Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $financeAccount->id,
            ]),
            'amount' => 5000,
        ]);
        Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $financeAccount->id,
            ]),
            'amount' => -2000,
        ]);

        $this->assertEquals(13000, $financeAccount->getCurrentBalance());
    }
}
