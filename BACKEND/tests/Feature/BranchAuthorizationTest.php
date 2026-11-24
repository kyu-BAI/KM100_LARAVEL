<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class BranchAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected User $knoahMariStaff;
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

        $this->knoahMariStaff = User::create([
            'name' => 'Knoah Mari Staff',
            'email' => 'knoahmari@km100.ph',
            'password' => Hash::make('Employee123!'),
            'role' => 'employee',
            'branch' => 'Knoah Mari',
            'department' => 'Operations',
            'is_active' => true,
        ]);
    }

    public function test_employee_can_only_view_assigned_branch_receipts(): void
    {
        // Admin creates Knoah Mari and Red Goose records
        $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
            'table' => 'inventory_items',
            'file_name' => 'KM_ITEM.jpg',
            'entity' => 'Knoah Mari',
            'amount' => 100.00,
        ]);

        $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/receipts', [
            'table' => 'inventory_items',
            'file_name' => 'RG_ITEM.jpg',
            'entity' => 'Red Goose',
            'amount' => 200.00,
        ]);

        // Knoah Mari staff queries receipts
        $response = $this->actingAs($this->knoahMariStaff, 'sanctum')
            ->getJson('/api/v1/receipts?table=inventory_items');

        $response->assertStatus(200);

        $items = $response->json('data');
        $this->assertCount(1, $items);
        $this->assertEquals('Knoah Mari', $items[0]['entity']);
    }

    public function test_employee_cannot_create_record_for_different_branch(): void
    {
        $response = $this->actingAs($this->knoahMariStaff, 'sanctum')
            ->postJson('/api/v1/receipts', [
                'table' => 'inventory_items',
                'file_name' => 'ILLEGAL_RG_ITEM.jpg',
                'entity' => 'Red Goose',
                'amount' => 150.00,
            ]);

        $response->assertStatus(403);
    }

    public function test_employee_cannot_access_employee_management(): void
    {
        $response = $this->actingAs($this->knoahMariStaff, 'sanctum')
            ->getJson('/api/v1/employees');

        $response->assertStatus(403);
    }
}
