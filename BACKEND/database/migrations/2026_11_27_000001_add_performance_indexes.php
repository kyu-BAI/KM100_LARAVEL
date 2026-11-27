<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->index(['role', 'name'], 'idx_users_role_name');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->index(['entity', 'created_at'], 'idx_inventory_items_entity_created');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_role_name');
        });

        Schema::table('inventory_items', function (Blueprint $table) {
            $table->dropIndex('idx_inventory_items_entity_created');
        });
    }
};
