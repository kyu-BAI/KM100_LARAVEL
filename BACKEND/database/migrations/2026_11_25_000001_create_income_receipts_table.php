<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('income_receipts')) {
            Schema::create('income_receipts', function (Blueprint $table) {
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
                $table->string('unit', 50)->default('day');
                $table->string('status', 50)->default('Active');
                $table->string('file_format', 20)->default('DAILY');
                $table->string('file_size', 50)->default('0 KB');
                $table->longText('file_path')->nullable();
                $table->text('notes')->nullable();
                $table->json('tags')->nullable();
                $table->json('preview_data')->nullable();
                $table->timestamp('scanned_at')->nullable();
                $table->timestamps();

                $table->index(['entity', 'year'], 'idx_income_receipts_ent_yr');
                $table->index('receipt_date', 'idx_income_receipts_rec_dt');
                $table->index('category_id', 'idx_income_receipts_cat_id');
                $table->index('status', 'idx_income_receipts_status');
                $table->index('created_at', 'idx_income_receipts_created');

                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('set null');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('income_receipts');
    }
};
