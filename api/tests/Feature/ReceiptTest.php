<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\Media;
use App\Models\Receipt;
use App\Models\TaxAccount;
use App\Models\FinanceContact;
use App\Models\TemporaryUpload;
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

    public function test_can_create_receipt_with_media(): void
    {
        $club = Club::factory()->create();
        $financeContact = FinanceContact::factory()->create(['club_id' => $club->id]);
        $taxAccount = TaxAccount::factory()->create(['club_id' => $club->id]);

        $temporaryUpload = new TemporaryUpload();
        $temporaryUpload->id = 0;
        $temporaryUpload->exists = true;

        $media = Media::create([
            'model_type' => TemporaryUpload::class,
            'model_id' => 0,
            'uuid' => \Illuminate\Support\Str::uuid(),
            'collection_name' => 'receipts',
            'name' => 'test-receipt',
            'file_name' => 'test-receipt.pdf',
            'mime_type' => 'application/pdf',
            'disk' => 'private',
            'conversions_disk' => 'private',
            'size' => 1024,
            'manipulations' => [],
            'custom_properties' => [],
            'generated_conversions' => [],
            'responsive_images' => [],
            'club_id' => $club->id,
        ]);

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('receipts')
            ->withData([
                'type' => 'receipts',
                'attributes' => [
                    'referenceNumber' => 'TEST-001',
                    'receiptType' => 'expense',
                    'bookingDate' => '2026-01-15',
                    'amount' => '100.00',
                ],
                'relationships' => [
                    'club' => [
                        'data' => ['type' => 'clubs', 'id' => (string) $club->id],
                    ],
                    'financeContact' => [
                        'data' => ['type' => 'finance-contacts', 'id' => (string) $financeContact->id],
                    ],
                    'taxAccount' => [
                        'data' => ['type' => 'tax-accounts', 'id' => (string) $taxAccount->id],
                    ],
                    'media' => [
                        'data' => [
                            ['type' => 'media', 'id' => (string) $media->id],
                        ],
                    ],
                ],
            ])
            ->post('/api/v1/receipts');

        $response->assertCreated();

        $receipt = Receipt::find($response->json('data.id'));
        $this->assertNotNull($receipt);
        $this->assertEquals(1, $receipt->media()->count());
        $this->assertEquals($media->id, $receipt->media()->first()->id);
        $this->assertEquals(Receipt::class, $receipt->media()->first()->model_type);
    }

    public function test_can_update_receipt_with_existing_media(): void
    {
        $club = Club::factory()->create();
        $financeContact = FinanceContact::factory()->create(['club_id' => $club->id]);
        $taxAccount = TaxAccount::factory()->create(['club_id' => $club->id]);

        $receipt = Receipt::factory()->create([
            'club_id' => $club->id,
            'finance_contact_id' => $financeContact->id,
            'tax_account_id' => $taxAccount->id,
            'reference_number' => 'Receipt-001',
            'receipt_type' => 'expense',
            'booking_date' => date('2026-01-10'),
            'amount' => '12345',
        ]);

        $media = Media::create([
            'model_type' => Receipt::class,
            'model_id' => $receipt->id,
            'uuid' => \Illuminate\Support\Str::uuid(),
            'collection_name' => 'receipts',
            'name' => 'receipt',
            'file_name' => 'receipt.pdf',
            'mime_type' => 'application/pdf',
            'disk' => 'private',
            'conversions_disk' => 'private',
            'size' => 1024,
            'manipulations' => [],
            'custom_properties' => [],
            'generated_conversions' => [],
            'responsive_images' => [],
            'club_id' => $club->id,
        ]);

        $this->assertEquals(1, $receipt->media()->count());

        $response = $this
            ->actingAs($club)
            ->jsonApi()
            ->expects('receipts')
            ->withData([
                'type' => 'receipts',
                'id' => (string) $receipt->id,
                'attributes' => [
                    'referenceNumber' => 'updated',
                    'receiptType' => 'income',
                    'amount' => '123',
                ],
                'relationships' => [
                    'club' => [
                        'data' => ['type' => 'clubs', 'id' => (string) $club->id],
                    ],
                    'financeContact' => [
                        'data' => ['type' => 'finance-contacts', 'id' => (string) $financeContact->id],
                    ],
                    'taxAccount' => [
                        'data' => ['type' => 'tax-accounts', 'id' => (string) $taxAccount->id],
                    ],
                    'media' => [
                        'data' => [
                            ['type' => 'media', 'id' => (string) $media->id],
                        ],
                    ],
                ],
            ])
            ->patch('/api/v1/receipts/' . $receipt->id);

        $response->assertOk();

        $receipt->refresh();

        $this->assertEquals('updated', $receipt->reference_number);
        $this->assertEquals('income', $receipt->receipt_type);
        $this->assertEquals('123', $receipt->amount);
        $this->assertEquals(1, $receipt->media()->count());
        $this->assertEquals($media->id, $receipt->media()->first()->id);
        $this->assertEquals(Receipt::class, $media->model_type);
        $this->assertEquals($receipt->id, $media->model_id);
    }
}
