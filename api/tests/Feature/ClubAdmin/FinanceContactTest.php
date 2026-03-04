<?php

namespace Tests\Feature\ClubAdmin;

use App\Models\Club;
use App\Models\FinanceContact;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class FinanceContactTest extends TestCase
{
    use DatabaseTransactions;

    public function test_admin_user_cannot_edit_external_finance_contacts(): void
    {
        $user = User::factory()->create();
        $club = Club::factory()->create();
        $financeContact = FinanceContact::factory()->create([
            'club_id' => $club->getKey(),
            'is_external' => true,
            'first_name' => 'Original First Name',
        ]);

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $data = [
            'type' => 'finance-contacts',
            'id' => (string) $financeContact->getKey(),
            'attributes' => [
                'firstName' => 'New First Name',
            ],
        ];

        $response = $this
            ->actingAs($user)
            ->jsonApi()
            ->expects('finance-contacts')
            ->withData($data)
            ->patch("/api/v1/finance-contacts/{$financeContact->getKey()}");

        $response->assertStatus(403);

        $this->assertDatabaseHas('finance_contacts', [
            'id' => $financeContact->getKey(),
            'first_name' => "Original First Name",
        ]);
    }
}
