<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\TaxAccount;
use App\Models\TaxAccountChart;

class TaxAccountsTest extends TestCase
{
    public function test_club_can_only_get_related_tax_accounts(): void
    {
        $taxAccountChart = TaxAccountChart::factory()->create();
        $otherTaxAccountChart = TaxAccountChart::factory()->create();
        $club = Club::factory()->create([
            'tax_account_chart_id' => $taxAccountChart->getKey(),
        ]);

        $taxAccounts = TaxAccount::factory(3)->create([
            'tax_account_chart_id' => $taxAccountChart->getKey(),
        ]);

        $otherTaxAccount = TaxAccount::factory()->create([
            'tax_account_chart_id' => $otherTaxAccountChart->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('tax-accounts')
            ->get('/api/v1/tax-accounts');

        $response->assertOk()->assertFetchedMany($taxAccounts);

        $this->assertNotContains((string) $otherTaxAccount->id, $response->json('data.*.id'));
    }
}
