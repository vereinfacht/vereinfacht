<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceAccount;
use App\Models\Statement;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class StatementTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_statements()
    {
        $club = Club::factory()->create();

        $financeAccount = FinanceAccount::factory()->create([
            'club_id' => $club->id
        ]);
        $statements = Statement::factory()->count(3)->create([
            'club_id' => $club->id,
            'finance_account_id' => $financeAccount->id,
        ]);

        $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('statements')
            ->get('/api/v1/statements')
            ->assertOk()
            ->assertFetchedMany($statements);
    }
}
