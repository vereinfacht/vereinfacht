<?php

namespace Tests\Feature;

use App\Models\Club;
use App\Models\FinanceContact;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinanceContactTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_finance_contacts(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $financeContacts = FinanceContact::factory(2)->create([
            'club_id' => $club->getKey(),
        ]);
        $otherFinanceContact = FinanceContact::factory()->create([
            'club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('finance-contacts')
            ->get('/api/v1/finance-contacts');

        $response
            ->assertOk()
            ->assertFetchedMany($financeContacts)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'finance-contacts',
                        'id' => $otherFinanceContact->getKey(),
                    ],
                ],
            ]);
    }
}
