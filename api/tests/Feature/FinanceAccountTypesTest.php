<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceAccountType;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinanceAccountTypesTest extends TestCase
{
    use DatabaseTransactions;

    public function test_api_can_get_finance_account_types()
    {
        $club = Club::factory()->create();
        $types = FinanceAccountType::factory()->count(3)->create();

        $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('finance-account-types')
            ->get('/api/v1/finance-account-types')
            ->assertOk()
            ->assertFetchedMany($types);
    }
}
