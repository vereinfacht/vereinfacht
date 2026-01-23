<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Club;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class MediaUploadTest extends TestCase
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
}
