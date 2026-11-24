<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * List of the 8 dedicated KM100 receipt and inventory tables.
     */
    protected array $tables = [
        'petc_sales_receipts',
        'petc_insurance_receipts',
        'petc_expense_receipts',
        'red_goose_expense_receipts',
        'knoah_mari_expense_receipts',
        'consumables_receipts',
        'voucher_receipts',
        'inventory_items',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::create($tableName, function (Blueprint $table) use ($tableName) {
                $table->uuid('id')->primary();
                $table->uuid('user_id')->nullable()->index();
                $table->string('file_name', 255);
                $table->string('title', 255)->nullable();
                $table->string('establishment', 255)->nullable();
                $table->string('receipt_date', 50)->nullable();
                $table->text('description')->nullable();
                $table->string('category', 100)->nullable();
                $table->string('category_id', 100)->nullable();
                $table->string('sub_category', 100)->nullable();
                $table->string('sub_category_id', 100)->nullable();
                $table->string('entity', 100)->nullable();
                $table->string('year', 10)->nullable();
                $table->string('month', 20)->nullable();
                $table->decimal('amount', 12, 2)->default(0.00);
                $table->string('currency', 10)->default('PHP');
                $table->decimal('quantity', 10, 2)->default(1.00);
                $table->string('unit', 50)->default('receipt');
                $table->string('status', 50)->default('Active');
                $table->string('file_format', 20)->default('JPG');
                $table->string('file_size', 50)->default('0 KB');
                $table->longText('file_path')->nullable(); // LongText supports base64 JPEG up to 4GB
                $table->text('notes')->nullable();
                $table->json('tags')->nullable();
                $table->json('preview_data')->nullable();
                $table->timestamp('scanned_at')->nullable();
                $table->timestamps();

                // Composite and query optimization indexes
                $table->index(['entity', 'year'], "idx_{$tableName}_ent_yr");
                $table->index('receipt_date', "idx_{$tableName}_rec_dt");
                $table->index('category_id', "idx_{$tableName}_cat_id");
                $table->index('status', "idx_{$tableName}_status");
                $table->index('created_at', "idx_{$tableName}_created");

                // Foreign key constraint to users table with null on delete
                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('set null');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach ($this->tables as $tableName) {
            Schema::dropIfExists($tableName);
        }
    }
};
