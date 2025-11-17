<?php

namespace Tests\Feature\JsonApi\Filters;

use Tests\TestCase;
use App\Models\Club;
use App\Models\Statement;
use App\Models\Transaction;
use App\Models\FinanceAccount;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class QueryFilterCurrencyTest extends TestCase
{
    use DatabaseTransactions;

    public function test_query_filter_converts_formatted_amounts_to_cents()
    {
        $filter = new \App\JsonApi\Filters\QueryFilter('query', ['amount'], ['amount']);
        $club = Club::factory()->create();
        $account = FinanceAccount::factory()->create(['club_id' => $club->id]);

        $transaction = Transaction::factory()->create([
            'title' => 'Test Transaction',
            'amount' => 1234,
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $query = Transaction::query();
        $filteredQuery = $filter->apply($query, '12.34');
        $results = $filteredQuery->get();

        $this->assertCount(1, $results);
        $this->assertEquals($transaction->id, $results->first()->id);

        $otherQuery = Transaction::query();
        $otherFilteredQuery = $filter->apply($otherQuery, '12,34');
        $otherResults = $otherFilteredQuery->get();

        $this->assertCount(1, $otherResults);
        $this->assertEquals($transaction->id, $otherResults->first()->id);
    }

    public function test_query_filter_handles_multiple_currency_formats()
    {
        $filter = new \App\JsonApi\Filters\QueryFilter('query', ['amount'], ['amount']);
        $club = Club::factory()->create();
        $account = FinanceAccount::factory()->create(['club_id' => $club->id]);

        $transaction = Transaction::factory()->create([
            'amount' => 10000,
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $otherTransaction = Transaction::factory()->create([
            'amount' => 2550,
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $query = Transaction::query();
        $results = $filter->apply($query, '100')->get();
        $this->assertCount(1, $results);
        $this->assertEquals($transaction->id, $results->first()->id);

        $otherQuery = Transaction::query();
        $otherResults = $filter->apply($otherQuery, '25.50')->get();
        $this->assertCount(1, $otherResults);
        $this->assertEquals($otherTransaction->id, $otherResults->first()->id);
    }

    public function test_query_filter_works_with_mixed_columns()
    {
        $filter = new \App\JsonApi\Filters\QueryFilter('query', ['title', 'amount'], ['amount']);
        $club = Club::factory()->create();
        $account = FinanceAccount::factory()->create(['club_id' => $club->id]);

        $transaction = Transaction::factory()->create([
            'title' => 'Special Transaction',
            'amount' => 5000,
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $otherTransaction = Transaction::factory()->create([
            'title' => 'Regular Transaction',
            'amount' => 1234,
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $query = Transaction::query();
        $results = $filter->apply($query, 'Special')->get();
        $this->assertCount(1, $results);
        $this->assertEquals($transaction->id, $results->first()->id);

        $otherQuery = Transaction::query();
        $otherResults = $filter->apply($otherQuery, '12.34')->get();
        $this->assertCount(1, $otherResults);
        $this->assertEquals($otherTransaction->id, $otherResults->first()->id);
    }
}
