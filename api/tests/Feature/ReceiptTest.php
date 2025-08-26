<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\Receipt;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class ReceiptTest extends TestCase
{
    use DatabaseTransactions;

    public function test_club_can_only_get_own_receipts(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $receipts = Receipt::factory(2)->create([
            'club_id' => $club->getKey(),
        ]);
        $otherReceipt = Receipt::factory()->create([
            'club_id' => $otherClub->getKey(),
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('receipts')
            ->get('/api/v1/receipts');

        $response
            ->assertOk()
            ->assertFetchedMany($receipts)
            ->assertJsonMissing([
                'data' => [
                    [
                        'type' => 'receipts',
                        'id' => $otherReceipt->getKey(),
                    ],
                ],
            ]);
    }
}
