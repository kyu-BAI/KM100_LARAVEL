<?php

namespace Tests\Feature;

use App\Models\InventoryItem;
use App\Models\PetcSalesReceipt;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class DatabaseSchemaTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test all 8 receipt tables and user/auth tables exist in MySQL.
     */
    public function test_all_expected_tables_exist(): void
    {
        $tables = [
            'users',
            'personal_access_tokens',
            'sessions',
            'inventory_items',
            'petc_sales_receipts',
            'petc_insurance_receipts',
            'petc_expense_receipts',
            'red_goose_expense_receipts',
            'knoah_mari_expense_receipts',
            'consumables_receipts',
            'voucher_receipts',
        ];

        foreach ($tables as $table) {
            $this->assertTrue(Schema::hasTable($table), "Expected table [{$table}] does not exist in schema.");
        }
    }

    /**
     * Test UUID primary keys are automatically generated.
     */
    public function test_models_generate_valid_uuid_primary_keys(): void
    {
        $user = User::factory()->create();
        $this->assertTrue(Str::isUuid($user->id));

        $item = InventoryItem::create([
            'file_name' => 'UUID_TEST.jpg',
            'amount' => 125.00,
            'entity' => 'PETC',
        ]);

        $this->assertTrue(Str::isUuid($item->id));
        $this->assertDatabaseHas('inventory_items', ['id' => $item->id]);
    }

    /**
     * Test unique constraint on users table prevents duplicate email.
     */
    public function test_users_table_enforces_unique_email_constraint(): void
    {
        User::factory()->create(['email' => 'duplicate@km100.ph']);

        $this->expectException(QueryException::class);

        User::factory()->create(['email' => 'duplicate@km100.ph']);
    }

    /**
     * Test Eloquent relationships and foreign key ON DELETE SET NULL behavior.
     */
    public function test_relationships_and_foreign_key_set_null_behavior(): void
    {
        $user = User::factory()->create();

        $receipt = InventoryItem::create([
            'user_id' => $user->id,
            'file_name' => 'FK_TEST.jpg',
            'title' => 'FK Test Title',
            'amount' => 750.00,
            'entity' => 'PETC',
        ]);

        // Test BelongsTo relationship
        $this->assertNotNull($receipt->user);
        $this->assertEquals($user->id, $receipt->user->id);

        // Test HasMany relationship
        $this->assertTrue($user->inventoryItems->contains('id', $receipt->id));

        // When user is deleted, receipt data MUST NOT be deleted (ON DELETE SET NULL)
        $user->delete();

        $receipt->refresh();
        $this->assertNull($receipt->user_id);
        $this->assertDatabaseHas('inventory_items', ['id' => $receipt->id]);
    }

    /**
     * Test decimal precision and JSON columns handling.
     */
    public function test_decimal_precision_and_json_casting(): void
    {
        $item = InventoryItem::create([
            'file_name' => 'DECIMAL_TEST.jpg',
            'amount' => 1499.95,
            'quantity' => 2.50,
            'entity' => 'PETC',
            'tags' => ['calibration', 'inspection'],
            'preview_data' => [
                'merchant' => 'Testing Center Inc.',
                'line_items' => [
                    ['desc' => 'Calibration', 'price' => 1499.95],
                ],
            ],
        ]);

        $item->refresh();

        // Verify decimal precision preserved
        $this->assertEquals('1499.95', (string) $item->amount);
        $this->assertEquals('2.50', (string) $item->quantity);

        // Verify JSON array casting
        $this->assertIsArray($item->tags);
        $this->assertContains('calibration', $item->tags);
        $this->assertIsArray($item->preview_data);
        $this->assertEquals('Testing Center Inc.', $item->preview_data['merchant']);
    }

    /**
     * Test full CRUD lifecycle on dedicated receipt models.
     */
    public function test_dedicated_receipt_model_crud_lifecycle(): void
    {
        // 1. Create
        $receipt = PetcSalesReceipt::create([
            'file_name' => 'SALES_CRUD.jpg',
            'title' => 'Initial Title',
            'amount' => 500.00,
            'entity' => 'PETC',
        ]);
        $this->assertDatabaseHas('petc_sales_receipts', ['id' => $receipt->id]);

        // 2. Read
        $found = PetcSalesReceipt::find($receipt->id);
        $this->assertNotNull($found);
        $this->assertEquals('Initial Title', $found->title);

        // 3. Update
        $found->update([
            'title' => 'Updated Title',
            'amount' => 600.00,
        ]);
        $this->assertDatabaseHas('petc_sales_receipts', [
            'id' => $receipt->id,
            'title' => 'Updated Title',
            'amount' => 600.00,
        ]);

        // 4. Delete
        $found->delete();
        $this->assertDatabaseMissing('petc_sales_receipts', ['id' => $receipt->id]);
    }
}
