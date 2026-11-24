<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class FileStorageTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $employee;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

        $this->admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@km100.ph',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);

        $this->employee = User::create([
            'name' => 'Knoah Mari Staff',
            'email' => 'knoahmari@km100.ph',
            'password' => Hash::make('Employee123!'),
            'role' => 'employee',
            'branch' => 'Knoah Mari',
            'department' => 'Operations',
            'is_active' => true,
        ]);
    }

    public function test_authenticated_user_can_upload_valid_receipt_image(): void
    {
        $file = UploadedFile::fake()->image('receipt.jpg', 600, 800)->size(500); // 500 KB

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
            'folder' => 'receipts',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'file_name' => 'receipt.jpg',
                    'file_format' => 'JPG',
                ],
            ]);

        $storagePath = $response->json('data.storage_path');
        Storage::disk('public')->assertExists($storagePath);
    }

    public function test_authenticated_user_can_upload_valid_pdf_document(): void
    {
        $file = UploadedFile::fake()->create('contract.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
            'folder' => 'documents',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'file_name' => 'contract.pdf',
                    'file_format' => 'PDF',
                ],
            ]);
    }

    public function test_upload_fails_with_invalid_file_extension(): void
    {
        $file = UploadedFile::fake()->create('malicious.exe', 500, 'application/octet-stream');

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_upload_fails_when_file_exceeds_maximum_size(): void
    {
        // 25 MB exceeds the 20 MB limit
        $file = UploadedFile::fake()->create('large.jpg', 25600, 'image/jpeg');

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file']);
    }

    public function test_can_upload_base64_image_payload(): void
    {
        $base64 = 'data:image/jpeg;base64,' . base64_encode('sample-image-content');

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'image_base64' => $base64,
        ]);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertStringContainsString('/storage/receipts/', $response->json('data.file_path'));
    }

    public function test_can_retrieve_uploaded_file(): void
    {
        $file = UploadedFile::fake()->image('invoice.png', 400, 400);
        $uploadRes = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
        ]);

        $storagePath = $uploadRes->json('data.storage_path');

        $getRes = $this->actingAs($this->admin, 'sanctum')->get('/api/v1/files/' . $storagePath);
        $getRes->assertStatus(200);
    }

    public function test_path_traversal_attempts_are_blocked(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')->get('/api/v1/files/../../.env');
        $response->assertStatus(404);
    }

    public function test_employee_cannot_delete_storage_files(): void
    {
        $file = UploadedFile::fake()->image('memo.jpg', 200, 200);
        $uploadRes = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
        ]);
        $storagePath = $uploadRes->json('data.storage_path');

        $delRes = $this->actingAs($this->employee, 'sanctum')->deleteJson('/api/v1/files/' . $storagePath);
        $delRes->assertStatus(403);
    }

    public function test_admin_can_delete_storage_files(): void
    {
        $file = UploadedFile::fake()->image('draft.jpg', 200, 200);
        $uploadRes = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
        ]);
        $storagePath = $uploadRes->json('data.storage_path');

        $delRes = $this->actingAs($this->admin, 'sanctum')->deleteJson('/api/v1/files/' . $storagePath);
        $delRes->assertStatus(200)
            ->assertJson(['success' => true]);

        Storage::disk('public')->assertMissing($storagePath);
    }

    public function test_employee_cannot_retrieve_cross_branch_file(): void
    {
        // Admin uploads a file and attaches it to a Red Goose receipt
        $file = UploadedFile::fake()->image('red_goose_doc.jpg', 200, 200);
        $uploadRes = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'file' => $file,
        ]);
        $storagePath = $uploadRes->json('data.storage_path');
        $filePathUrl = $uploadRes->json('data.file_path');

        \App\Models\RedGooseExpenseReceipt::create([
            'user_id' => $this->admin->id,
            'file_name' => 'red_goose_doc.jpg',
            'entity' => 'Red Goose',
            'amount' => 500.00,
            'file_path' => $filePathUrl,
        ]);

        // Knoah Mari staff attempts to fetch the Red Goose file
        $getRes = $this->actingAs($this->employee, 'sanctum')->get('/api/v1/files/' . $storagePath);
        $getRes->assertStatus(403);
    }
}
