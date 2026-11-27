<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecurityHardeningTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $petcEmployee;
    protected User $knoahEmployee;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        $this->admin = User::create([
            'name' => 'Security Admin',
            'email' => 'sec-admin@km100.ph',
            'password' => Hash::make('AdminPass2026!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);

        $this->petcEmployee = User::create([
            'name' => 'PETC Staff',
            'email' => 'sec-petc@km100.ph',
            'password' => Hash::make('StaffPass2026!'),
            'role' => 'employee',
            'branch' => 'PETC',
            'department' => 'Operations',
            'is_active' => true,
        ]);

        $this->knoahEmployee = User::create([
            'name' => 'Knoah Staff',
            'email' => 'sec-knoah@km100.ph',
            'password' => Hash::make('StaffPass2026!'),
            'role' => 'employee',
            'branch' => 'Knoah Mari',
            'department' => 'Operations',
            'is_active' => true,
        ]);
    }

    public function test_forgot_password_never_exposes_token_and_prevents_enumeration(): void
    {
        $existingResp = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'sec-admin@km100.ph',
        ]);

        $missingResp = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'nonexistent@km100.ph',
        ]);

        $existingResp->assertStatus(200)->assertJsonMissingPath('token');
        $missingResp->assertStatus(200)->assertJsonMissingPath('token');
        $this->assertSame($existingResp->json('message'), $missingResp->json('message'));
    }

    public function test_base64_upload_rejects_script_and_html_subtypes(): void
    {
        foreach (['php', 'html', 'phtml', 'svg'] as $dangerousType) {
            $payload = "data:image/{$dangerousType};base64," . base64_encode('<?php echo 1; ?>');
            $resp = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
                'image_base64' => $payload,
            ]);
            $resp->assertStatus(422);
        }
    }

    public function test_employee_cannot_list_all_storage_files(): void
    {
        $resp = $this->actingAs($this->petcEmployee, 'sanctum')->getJson('/api/v1/files');
        $resp->assertStatus(403);
    }

    public function test_employee_cannot_access_cross_branch_income_file(): void
    {
        $uploadResp = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/files/upload', [
            'image_base64' => 'data:image/png;base64,' . base64_encode('fake-png-bytes'),
            'folder' => 'receipts',
        ]);
        $uploadResp->assertStatus(201);
        $fileUrl = $uploadResp->json('data.file_path');

        $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
            'table' => 'knoah_mari_income_receipts',
            'file_name' => 'KM_INCOME.png',
            'entity' => 'Knoah Mari',
            'amount' => 1500,
            'file_path' => $fileUrl,
        ])->assertStatus(201);

        $relativePath = ltrim(parse_url($fileUrl, PHP_URL_PATH), '/');
        $resp = $this->actingAs($this->petcEmployee, 'sanctum')->getJson("/api/v1/files/{$relativePath}");
        $resp->assertStatus(403);
    }

    public function test_invalid_table_parameter_returns_422(): void
    {
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts?table=users')
            ->assertStatus(422);

        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts/some-id?table=users')
            ->assertStatus(422);

        $this->actingAs($this->admin, 'sanctum')
            ->deleteJson('/api/v1/receipts/some-id?table=users')
            ->assertStatus(422);
    }

    public function test_employee_cannot_read_or_update_other_branch_record_case_insensitive(): void
    {
        $createResp = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
            'table' => 'knoah_mari_income_receipts',
            'file_name' => 'KM_INC_01.daily',
            'entity' => 'knoah mari',
            'amount' => 900,
        ]);
        $createResp->assertStatus(201);
        $id = $createResp->json('data.id');

        $this->actingAs($this->petcEmployee, 'sanctum')
            ->getJson("/api/v1/receipts/{$id}?table=knoah_mari_income_receipts")
            ->assertStatus(403);

        $this->actingAs($this->petcEmployee, 'sanctum')
            ->putJson("/api/v1/receipts/{$id}", [
                'table' => 'knoah_mari_income_receipts',
                'entity' => 'PETC',
                'amount' => 10,
            ])
            ->assertStatus(403);
    }

    public function test_sanctum_token_expiration_is_configured(): void
    {
        $expiration = config('sanctum.expiration');
        $this->assertNotNull($expiration);
        $this->assertGreaterThan(0, (int) $expiration);
    }
}
