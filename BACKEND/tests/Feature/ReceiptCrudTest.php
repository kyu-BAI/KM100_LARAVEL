<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class ReceiptCrudTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@km100.ph',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);
    }

    public function test_can_create_receipt_in_dedicated_table(): void
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'knoah_mari_expense_receipts',
                'file_name' => 'PETC_EXP-KM_2026_02_23_REC-101.jpg',
                'title' => 'Office Supplies',
                'establishment' => 'National Book Store',
                'receipt_date' => '2026-02-23',
                'entity' => 'Knoah Mari',
                'category' => 'Expenses',
                'amount' => 1450.50,
                'currency' => 'PHP',
                'notes' => 'Testing receipt creation',
                'tags' => ['office', 'supplies'],
            ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'file_name' => 'PETC_EXP-KM_2026_02_23_REC-101.jpg',
                    'title' => 'Office Supplies',
                    'establishment' => 'National Book Store',
                    'amount' => 1450.50,
                    'entity' => 'Knoah Mari',
                ],
            ]);

        $this->assertDatabaseHas('knoah_mari_expense_receipts', [
            'file_name' => 'PETC_EXP-KM_2026_02_23_REC-101.jpg',
            'establishment' => 'National Book Store',
        ]);
    }

    public function test_can_list_receipts_with_filters(): void
    {
        // Insert sample record
        $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'petc_sales_receipts',
                'file_name' => 'SALES_2026_01.jpg',
                'entity' => 'PETC',
                'amount' => 500.00,
                'year' => '2026',
            ]);

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/v1/receipts?table=petc_sales_receipts&year=2026');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'meta' => [
                    'table' => 'petc_sales_receipts',
                    'total' => 1,
                ],
            ]);
    }

    public function test_can_update_receipt(): void
    {
        $createResponse = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'inventory_items',
                'file_name' => 'ORIGINAL_ITEM.jpg',
                'title' => 'Original Title',
                'entity' => 'PETC',
                'amount' => 100.00,
            ]);

        $receiptId = $createResponse->json('data.id');

        $updateResponse = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/v1/receipts/{$receiptId}", [
                'table' => 'inventory_items',
                'title' => 'Updated Title',
                'amount' => 250.00,
            ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $receiptId,
                    'title' => 'Updated Title',
                    'amount' => 250.00,
                ],
            ]);

        $this->assertDatabaseHas('inventory_items', [
            'id' => $receiptId,
            'title' => 'Updated Title',
            'amount' => 250.00,
        ]);
    }

    public function test_can_delete_single_receipt(): void
    {
        $createResponse = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'voucher_receipts',
                'file_name' => 'VOUCHER_TO_DELETE.jpg',
                'entity' => 'PETC',
                'amount' => 300.00,
            ]);

        $receiptId = $createResponse->json('data.id');

        $deleteResponse = $this->actingAs($this->admin, 'sanctum')
            ->deleteJson("/api/v1/receipts/{$receiptId}?table=voucher_receipts");

        $deleteResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('voucher_receipts', ['id' => $receiptId]);
    }

    public function test_can_bulk_delete_receipts(): void
    {
        $res1 = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'consumables_receipts',
                'file_name' => 'BULK_1.jpg',
                'entity' => 'PETC',
                'amount' => 10.00,
            ]);
        $res2 = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'consumables_receipts',
                'file_name' => 'BULK_2.jpg',
                'entity' => 'PETC',
                'amount' => 20.00,
            ]);

        $id1 = $res1->json('data.id');
        $id2 = $res2->json('data.id');

        $bulkResponse = $this->actingAs($this->admin, 'sanctum')
            ->postJson('/api/v1/receipts/bulk-delete', [
                'table' => 'consumables_receipts',
                'ids' => [$id1, $id2],
            ]);

        $bulkResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'deleted_count' => 2,
                ],
            ]);

        $this->assertDatabaseMissing('consumables_receipts', ['id' => $id1]);
        $this->assertDatabaseMissing('consumables_receipts', ['id' => $id2]);
    }
}
