<?php

namespace Tests\Feature\JsonApi\Filters;

use Tests\TestCase;
use App\Models\Club;
use App\Models\Statement;
use App\Models\Transaction;
use App\Models\FinanceAccount;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class QueryFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_query_filter_searches_multiple_transaction_columns()
    {
        $club = Club::factory()->create();
        $account = FinanceAccount::factory()->create([
            'club_id' => $club->id
        ]);

        $matchingTransaction1 = Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
            'name' => 'Membership Fee',
            'description' => 'Annual club membership',
            'amount' => 100,
        ]);

        $matchingTransaction2 = Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
            'name' => 'Other',
            'description' => 'Special membership discount',
            'amount' => 50,
        ]);

        $nonMatchingTransaction = Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
            'name' => 'Refund',
            'description' => 'Bank refund',
            'amount' => 200,
        ]);

        $response = $this->actingAs($club)
            ->jsonApi()
            ->expects('transactions')
            ->filter(['query' => 'membership'])
            ->get('/api/v1/transactions')
            ->assertOk();

        $response->assertFetchedMany([
            $matchingTransaction1->id,
            $matchingTransaction2->id,
        ]);

        $data = collect($response->json('data'))->pluck('id')->all();
        $this->assertNotContains($nonMatchingTransaction->id, $data);
    }
}
