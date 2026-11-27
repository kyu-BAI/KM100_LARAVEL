<?php

namespace Tests\Feature;

use App\Models\InventoryItem;
use App\Models\PetcIncomeReceipt;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SystemRegressionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $petcEmployee;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'QA Admin',
            'email' => 'qa-admin@km100.ph',
            'password' => Hash::make('QaAdmin2026!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);

        $this->petcEmployee = User::create([
            'name' => 'QA PETC Staff',
            'email' => 'qa-petc@km100.ph',
            'password' => Hash::make('QaStaff2026!'),
            'role' => 'employee',
            'branch' => 'PETC',
            'department' => 'Operations',
            'is_active' => true,
        ]);
    }

    public function test_expired_sanctum_token_is_rejected(): void
    {
        $newToken = $this->admin->createToken('expired-test');
        $plainText = $newToken->plainTextToken;

        $expirationMinutes = (int) config('sanctum.expiration', 1440);
        DB::table('personal_access_tokens')
            ->where('id', $newToken->accessToken->id)
            ->update(['created_at' => now()->subMinutes($expirationMinutes + 10)]);

        $this->withHeader('Authorization', 'Bearer ' . $plainText)
            ->getJson('/api/v1/auth/me')
            ->assertStatus(401);
    }

    public function test_receipt_listing_supports_pagination_and_search(): void
    {
        for ($i = 1; $i <= 12; $i++) {
            $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
                'table' => 'petc_expense_receipts',
                'file_name' => "EXP_ITEM_{$i}.jpg",
                'title' => $i === 7 ? 'Special Printer Ink' : "Office Expense {$i}",
                'entity' => 'PETC',
                'amount' => 100 * $i,
            ])->assertStatus(201);
        }

        $page1 = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts?table=inventory_items&per_page=5&page=1')
            ->assertStatus(200);
        $page2 = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts?table=inventory_items&per_page=5&page=2')
            ->assertStatus(200);

        $this->assertCount(5, $page1->json('data'));
        $this->assertCount(5, $page2->json('data'));

        $ids1 = array_column($page1->json('data'), 'id');
        $ids2 = array_column($page2->json('data'), 'id');
        $this->assertEmpty(array_intersect($ids1, $ids2));

        $searchResp = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts?table=inventory_items&search=Printer')
            ->assertStatus(200);
        $this->assertCount(1, $searchResp->json('data'));
        $this->assertSame('Special Printer Ink', $searchResp->json('data.0.title'));
    }

    public function test_income_tables_crud_and_bulk_delete_consistency(): void
    {
        $created = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
            'table' => 'petc_income_receipts',
            'file_name' => 'INC_PETC_2026-11-27.daily',
            'title' => 'PETC Daily Income (2026-11-27)',
            'entity' => 'PETC',
            'category' => 'Income',
            'receipt_date' => '2026-11-27',
            'amount' => 4500.50,
        ])->assertStatus(201);

        $id = $created->json('data.id');
        $this->assertDatabaseHas('petc_income_receipts', ['id' => $id, 'amount' => 4500.50]);
        $this->assertDatabaseHas('inventory_items', ['id' => $id, 'amount' => 4500.50]);

        $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts/bulk-delete', [
            'table' => 'inventory_items',
            'ids' => [$id],
        ])->assertStatus(200);

        $this->assertNull(PetcIncomeReceipt::find($id));
        $this->assertNull(InventoryItem::find($id));
    }

    public function test_ocr_handles_malformed_ai_response_safely(): void
    {
        config(['services.gemini.key' => 'fake-test-key']);

        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    ['content' => ['parts' => [['text' => 'NOT VALID JSON {{{']]]],
                ],
            ], 200),
        ]);

        $resp = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/ocr/process', [
            'image' => 'data:image/jpeg;base64,' . base64_encode('test-image'),
            'receipt_type' => 'Expenses',
        ]);

        $resp->assertStatus(422)->assertJson(['success' => false]);
    }

    public function test_receipt_list_and_stats_have_no_n_plus_one_queries(): void
    {
        for ($i = 1; $i <= 15; $i++) {
            $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
                'table' => 'consumables_receipts',
                'file_name' => "ITEM_{$i}.item",
                'entity' => 'PETC',
                'amount' => 50,
            ])->assertStatus(201);
        }

        DB::flushQueryLog();
        DB::enableQueryLog();

        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts?table=inventory_items')
            ->assertStatus(200);
        $listQueries = count(DB::getQueryLog());

        DB::flushQueryLog();
        $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/stats/summary')
            ->assertStatus(200);
        $statsQueries = count(DB::getQueryLog());

        $this->assertLessThanOrEqual(5, $listQueries);
        $this->assertLessThanOrEqual(5, $statsQueries);
    }
}
