<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\User;
use App\Models\Media;
use App\Models\Receipt;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class MediaTest extends TestCase
{
    use DatabaseTransactions;

    public function test_user_cannot_upload_media_for_other_club(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();

        $user = User::factory()->create();
        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $response = $this
            ->actingAs($user)
            ->postJson('/api/v1/upload/media', [
                'collectionName' => 'receipts',
                'clubId' => $otherClub->id,
                'file' => $file,
            ]);

        $response->assertForbidden();
    }

    public function test_user_can_upload_media_for_own_club(): void
    {
        $club = Club::factory()->create();

        $user = User::factory()->create();
        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $response = $this
            ->actingAs($user)
            ->postJson('/api/v1/upload/media', [
                'collectionName' => 'receipts',
                'clubId' => $club->id,
                'file' => $file,
            ]);

        $response->assertCreated();
        $response->assertJsonStructure([
            'data' => [
                'type',
                'id',
            ],
        ]);
    }

    public function test_unauthenticated_user_cannot_upload_media(): void
    {
        $club = Club::factory()->create();
        $file = UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf');

        $response = $this->postJson('/api/v1/upload/media', [
            'collectionName' => 'receipts',
            'clubId' => $club->id,
            'file' => $file,
        ]);

        $response->assertUnauthorized();
    }

    public function test_user_can_download_media_for_own_club(): void
    {
        $club = Club::factory()->create();
        $user = User::factory()->create();
        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $receipt = Receipt::factory()->create(['club_id' => $club->id]);
        $media = $this->createMediaForReceipt($receipt, $club->id);

        $response = $this
            ->actingAs($user)
            ->get("/api/v1/media/{$media->id}/download");

        $response->assertOk();
        $this->assertNotEmpty($response->headers->get('content-type'));
    }

    public function test_user_cannot_download_media_for_other_club(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $user = User::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $receipt = Receipt::factory()->create(['club_id' => $otherClub->id]);
        $media = $this->createMediaForReceipt($receipt, $otherClub->id);

        $response = $this
            ->actingAs($user)
            ->get("/api/v1/media/{$media->id}/download");

        $response->assertForbidden();
    }

    public function test_unauthenticated_user_cannot_download_media(): void
    {
        $club = Club::factory()->create();
        $receipt = Receipt::factory()->create(['club_id' => $club->id]);
        $media = $this->createMediaForReceipt($receipt, $club->id);

        $response = $this->getJson("/api/v1/media/{$media->id}/download");

        $response->assertUnauthorized();
    }

    public function test_user_can_preview_media_for_own_club(): void
    {
        $club = Club::factory()->create();
        $user = User::factory()->create();
        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $receipt = Receipt::factory()->create(['club_id' => $club->id]);
        $media = $this->createMediaForReceipt($receipt, $club->id, withPreview: true);

        $response = $this
            ->actingAs($user)
            ->get("/api/v1/media/{$media->id}/preview");

        $response->assertOk();
        $this->assertNotEmpty($response->headers->get('content-type'));
    }

    public function test_user_cannot_preview_media_for_other_club(): void
    {
        $club = Club::factory()->create();
        $otherClub = Club::factory()->create();
        $user = User::factory()->create();

        setPermissionsTeamId($club);
        $user->assignRole('club admin');

        $receipt = Receipt::factory()->create(['club_id' => $otherClub->id]);
        $media = $this->createMediaForReceipt($receipt, $otherClub->id, withPreview: true);

        $response = $this
            ->actingAs($user)
            ->get("/api/v1/media/{$media->id}/preview");

        $response->assertForbidden();
    }

    public function test_unauthenticated_user_cannot_preview_media(): void
    {
        $club = Club::factory()->create();
        $receipt = Receipt::factory()->create(['club_id' => $club->id]);
        $media = $this->createMediaForReceipt($receipt, $club->id, withPreview: true);

        $response = $this->getJson("/api/v1/media/{$media->id}/preview");

        $response->assertUnauthorized();
    }

    private function createMediaForReceipt(Receipt $receipt, int $clubId, bool $withPreview = false): Media
    {
        $media = Media::create([
            'model_type' => Receipt::class,
            'model_id' => $receipt->id,
            'club_id' => $clubId,
            'collection_name' => 'receipts',
            'name' => 'receipt',
            'file_name' => 'fake-receipt.pdf',
            'mime_type' => 'application/pdf',
            'disk' => 'private',
            'conversions_disk' => 'private',
            'size' => 100,
            'manipulations' => [],
            'custom_properties' => [],
            'generated_conversions' => $withPreview ? ['preview' => true] : [],
            'responsive_images' => [],
            'order_column' => 1,
            'uuid' => \Illuminate\Support\Str::uuid(),
        ]);

        Storage::disk('private')->put(
            "{$clubId}/receipts/{$media->id}/{$media->file_name}",
            'fake pdf content'
        );

        if ($withPreview) {
            $fileNameWithoutExtension = pathinfo($media->file_name, PATHINFO_FILENAME);
            Storage::disk('private')->put(
                "{$clubId}/receipts/{$media->id}/conversions/{$fileNameWithoutExtension}-preview.jpg",
                'fake preview content'
            );
        }

        return $media;
    }
}
