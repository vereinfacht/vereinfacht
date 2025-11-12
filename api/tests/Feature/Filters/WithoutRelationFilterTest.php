<?php

namespace Tests\Feature\JsonApi\Filters;

use Tests\TestCase;
use App\Models\Club;
use App\Models\Receipt;
use App\Models\Statement;
use App\Models\Transaction;
use App\Models\FinanceAccount;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class WithoutRelationFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_only_transactions_without_receipts_are_returned_when_filter_applied()
    {
        $club = Club::factory()->create();
        $account = FinanceAccount::factory()->create([
            'club_id' => $club->id
        ]);

        $transactionWithReceipt = Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $receipt = Receipt::factory()->create([
            'club_id' => $club->id,
        ]);

        $transactionWithReceipt->receipts()->attach($receipt->id);

        $transactionWithoutReceipt = Transaction::factory()->create([
            'statement_id' => Statement::factory()->create([
                'club_id' => $club->id,
                'finance_account_id' => $account->id,
            ])->id,
        ]);

        $response = $this->actingAs($club)
            ->jsonApi()
            ->expects('transactions')
            ->filter(['withoutReceipts' => 'true'])
            ->get('/api/v1/transactions')
            ->assertOk();

        $response->assertFetchedMany([$transactionWithoutReceipt->id]);

        $data = collect($response->json('data'))->pluck('id')->all();
        $this->assertNotContains($transactionWithReceipt->id, $data);
    }
}
