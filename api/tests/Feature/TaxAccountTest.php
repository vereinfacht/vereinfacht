<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\TaxAccount;
use App\Models\TaxAccountChart;

class TaxAccountTest extends TestCase
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
            'club_id' => $club->getKey(),
        ]);

        $otherClub = Club::factory()->create();
        $otherTaxAccount = TaxAccount::factory()->create([
            'tax_account_chart_id' => $otherTaxAccountChart->getKey(),
            'club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('tax-accounts')
            ->get('/api/v1/tax-accounts');

        $response->assertOk()->assertFetchedMany($taxAccounts);

        $this->assertNotContains((string) $otherTaxAccount->id, $response->json('data.*.id'));
    }

    public function test_club_can_get_custom_tax_accounts_with_null_chart_relation(): void
    {
        $taxAccountChart = TaxAccountChart::factory()->create();
        $club = Club::factory()->create([
            'tax_account_chart_id' => $taxAccountChart->getKey(),
        ]);

        $chartTaxAccounts = TaxAccount::factory(2)->create([
            'tax_account_chart_id' => $taxAccountChart->getKey(),
            'club_id' => $club->getKey(),
        ]);

        $customTaxAccounts = TaxAccount::factory(2)->create([
            'tax_account_chart_id' => null,
            'club_id' => $club->getKey(),
        ]);

        $otherClub = Club::factory()->create();
        $otherTaxAccount = TaxAccount::factory()->create([
            'tax_account_chart_id' => null,
            'club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('tax-accounts')
            ->get('/api/v1/tax-accounts');

        $response->assertOk();

        $expectedTaxAccounts = $chartTaxAccounts->merge($customTaxAccounts);
        $response->assertFetchedMany($expectedTaxAccounts);

        $this->assertNotContains((string) $otherTaxAccount->id, $response->json('data.*.id'));
    }

    public function test_club_without_chart_can_only_get_custom_tax_accounts(): void
    {
        $club = Club::factory()->create([
            'tax_account_chart_id' => null,
        ]);

        $customTaxAccounts = TaxAccount::factory(2)->create([
            'tax_account_chart_id' => null,
            'club_id' => $club->getKey(),
        ]);

        $taxAccountChart = TaxAccountChart::factory()->create();
        $chartTaxAccounts = TaxAccount::factory(2)->create([
            'tax_account_chart_id' => $taxAccountChart->getKey(),
            'club_id' => $club->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('tax-accounts')
            ->get('/api/v1/tax-accounts');

        $response->assertOk();

        $response->assertFetchedMany($customTaxAccounts);

        foreach ($chartTaxAccounts as $taxAccount) {
            $this->assertNotContains((string) $taxAccount->id, $response->json('data.*.id'));
        }
    }
}
