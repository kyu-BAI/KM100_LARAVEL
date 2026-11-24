<?php

namespace Database\Seeders;

use App\Models\InventoryItem;
use App\Models\KnoahMariExpenseReceipt;
use App\Models\PetcExpenseReceipt;
use App\Models\PetcInsuranceReceipt;
use App\Models\PetcSalesReceipt;
use App\Models\RedGooseExpenseReceipt;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DevelopmentReceiptSeeder extends Seeder
{
    /**
     * Run the database seeds for development testing.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first() ?? User::factory()->admin()->create();

        $sampleData = [
            [
                'class' => PetcSalesReceipt::class,
                'entity' => 'PETC',
                'category' => 'PETC Sales',
                'category_id' => 'petc-sales',
                'title' => 'Emission Testing Fee - Light Duty',
                'file_name' => 'SALES_LT_001.jpg',
                'amount' => 550.00,
                'establishment' => 'KM100 PETC Inspection Center',
            ],
            [
                'class' => PetcInsuranceReceipt::class,
                'entity' => 'PETC',
                'category' => 'PETC Insurance',
                'category_id' => 'petc-insurance',
                'title' => 'CTPL Vehicle Insurance Policy',
                'file_name' => 'INS_CTPL_001.jpg',
                'amount' => 850.00,
                'establishment' => 'Alpha Insurance Inc.',
            ],
            [
                'class' => PetcExpenseReceipt::class,
                'entity' => 'PETC',
                'category' => 'Expenses',
                'category_id' => 'expenses',
                'title' => 'Smoke Meter Calibration Service',
                'file_name' => 'EXP_CALIB_001.jpg',
                'amount' => 3500.00,
                'establishment' => 'Precision Calibration Works',
            ],
            [
                'class' => RedGooseExpenseReceipt::class,
                'entity' => 'Red Goose',
                'category' => 'Expenses',
                'category_id' => 'expenses',
                'title' => 'Stationery and Toner Cartridges',
                'file_name' => 'EXP_RG_TONER_001.jpg',
                'amount' => 2450.00,
                'establishment' => 'Office Depot Supply Co.',
            ],
            [
                'class' => KnoahMariExpenseReceipt::class,
                'entity' => 'Knoah Mari',
                'category' => 'Expenses',
                'category_id' => 'expenses',
                'title' => 'Office Refreshments and Water Refill',
                'file_name' => 'EXP_KM_WATER_001.jpg',
                'amount' => 680.00,
                'establishment' => 'Crystal Clear Water Refilling',
            ],
        ];

        foreach ($sampleData as $item) {
            $class = $item['class'];
            unset($item['class']);

            $recordId = (string) Str::uuid();

            $attributes = array_merge([
                'id' => $recordId,
                'user_id' => $admin->id,
                'receipt_date' => date('Y-m-d'),
                'description' => 'Development test transaction',
                'sub_category' => "{$item['entity']} {$item['category']}",
                'sub_category_id' => Str::slug("{$item['entity']} {$item['category']}"),
                'year' => date('Y'),
                'month' => strtoupper(date('M')),
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'receipt',
                'status' => 'Active',
                'file_format' => 'JPG',
                'file_size' => '120 KB',
                'file_path' => null,
                'notes' => 'Development sample record',
                'tags' => ['sample', 'development'],
                'preview_data' => ['sample' => true],
                'scanned_at' => now(),
            ], $item);

            // Create in dedicated table
            $class::updateOrCreate(['file_name' => $item['file_name']], $attributes);

            // Mirror into master inventory_items
            InventoryItem::updateOrCreate(['file_name' => $item['file_name']], $attributes);
        }
    }
}
