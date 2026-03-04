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

    public function test_club_can_edit_external_finance_contacts(): void
    {
        $club = Club::factory()->create();
        $financeContact = FinanceContact::factory()->create([
            'club_id' => $club->getKey(),
            'is_external' => true,
            'first_name' => 'Original First Name',
        ]);

        $data = [
            'type' => 'finance-contacts',
            'id' => (string) $financeContact->getKey(),
            'attributes' => [
                'firstName' => 'New First Name',
            ],
        ];

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('finance-contacts')
            ->withData($data)
            ->patch("/api/v1/finance-contacts/{$financeContact->getKey()}");

        $response->assertFetchedOne($financeContact);

        $this->assertDatabaseHas('finance_contacts', [
            'id' => $financeContact->getKey(),
            'first_name' => "New First Name",
        ]);
    }

    public function test_creating_non_external_finance_contacts_requires_many_fields(): void
    {
        $club = Club::factory()->create();

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('finance-contacts')
            ->withJson([
                'data' => [
                    'type' => 'finance-contacts',
                    'attributes' => [
                        'contactType' => 'person',
                        'firstName' => 'John',
                        'lastName' => 'Doe',
                        'address' => '123 Main St',
                        'zipCode' => '12345',
                        'city' => 'Anytown',
                    ],
                    'relationships' => [
                        'club' => [
                            'data' => [
                                'type' => 'clubs',
                                'id' => (string) $club->getKey(),
                            ],
                        ],
                    ],
                ],
            ])
            ->post('/api/v1/finance-contacts');

        $response->assertCreated();
    }

    public function test_creating_external_finance_contacts_bypasses_most_required_rules(): void
    {
        $club = Club::factory()->create();

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('finance-contacts')
            ->withJson([
                'data' => [
                    'type' => 'finance-contacts',
                    'attributes' => [
                        'isExternal' => true,
                        'contactType' => 'person',
                    ],
                    'relationships' => [
                        'club' => [
                            'data' => [
                                'type' => 'clubs',
                                'id' => (string) $club->getKey(),
                            ],
                        ],
                    ],
                ],
            ])
            ->post('/api/v1/finance-contacts');

        $response->assertCreated();
    }
}
