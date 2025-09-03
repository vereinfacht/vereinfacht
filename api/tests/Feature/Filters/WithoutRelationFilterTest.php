<?php

namespace Tests\Feature\JsonApi\Filters;

use Tests\TestCase;
use App\Models\Club;
use App\Models\Receipt;
use App\Models\Transaction;
use App\Models\FinanceAccount;
use App\Models\FinanceAccountType;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class WithoutRelationFilterTest extends TestCase
{
    use DatabaseTransactions;

    public function test_only_transactions_without_receipts_are_returned_when_filter_applied()
    {
        $club = Club::factory()->create();
        $accountType = FinanceAccountType::factory()->create();
        $account = FinanceAccount::factory()->create([
            'club_id' => $club->id,
            'finance_account_type_id' => $accountType->id,
        ]);

        $transactionWithReceipt = Transaction::factory()->create([
            'club_id' => $club->id,
            'finance_account_id' => $account->id,
        ]);

        $receipt = Receipt::factory()->create([
            'club_id' => $club->id,
        ]);

        $transactionWithReceipt->receipts()->attach($receipt->id);

        $transactionWithoutReceipt = Transaction::factory()->create([
            'club_id' => $club->id,
            'finance_account_id' => $account->id,
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
