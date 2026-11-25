<?php

namespace Database\Seeders;

use App\Models\ConsumablesReceipt;
use App\Models\InventoryItem;
use App\Models\KnoahMariExpenseReceipt;
use App\Models\PetcExpenseReceipt;
use App\Models\PetcInsuranceReceipt;
use App\Models\PetcSalesReceipt;
use App\Models\RedGooseExpenseReceipt;
use App\Models\User;
use App\Models\VoucherReceipt;
use App\Services\ReceiptService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MockFolderDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $adminId = $admin ? $admin->id : 'a34c754b-291a-444a-8824-b8c551ab138b';

        // 1. SALES MOCK DATA
        $salesData = [
            [
                'class' => PetcSalesReceipt::class,
                'file_name' => 'SALES_PETC_2026_001.jpg',
                'title' => 'PETC Emission Testing Certification - MVIR #88412',
                'establishment' => 'KM100 PETC Inspection Center',
                'receipt_date' => '2026-01-15',
                'description' => 'Emission Testing Fee for Light Duty Vehicle',
                'category' => 'Sales',
                'category_id' => 'sales',
                'sub_category' => 'Sales 2026 (PETC)',
                'sub_category_id' => 'sales-2026-petc',
                'entity' => 'PETC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 600.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'certificate',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'KM100 PETC Inspection Center',
                    'receipt_date' => '2026-01-15',
                    'description' => 'Emission Testing Fee - Light Duty Vehicle',
                    'amount' => 600.00,
                    'or_number' => 'MVIR-88412',
                    'summary' => [
                        'Establishment' => 'KM100 PETC Inspection Center',
                        'Total Amount' => 'PHP 600.00',
                        'Receipt Date' => '2026-01-15',
                        'Official Ref' => 'MVIR-88412'
                    ]
                ]
            ],
            [
                'class' => null, // Stored in inventory_items
                'file_name' => 'SALES_RG_2026_001.jpg',
                'title' => 'Red Goose Dine-in Daily POS Terminal Sales',
                'establishment' => 'Red Goose Restaurant & Grill',
                'receipt_date' => '2026-01-20',
                'description' => 'Daily POS Dine-in & Takeout Register Settlement',
                'category' => 'Sales',
                'category_id' => 'sales',
                'sub_category' => 'Red Goose Sales 2026',
                'sub_category_id' => 'red-goose-sales-2026',
                'entity' => 'Red Goose',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 8450.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'register',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Red Goose Restaurant & Grill',
                    'receipt_date' => '2026-01-20',
                    'description' => 'Daily POS Dine-in & Takeout Register Settlement',
                    'amount' => 8450.00,
                    'or_number' => 'RG-POS-2026-0120',
                    'summary' => [
                        'Establishment' => 'Red Goose Restaurant & Grill',
                        'Total Amount' => 'PHP 8,450.00',
                        'Receipt Date' => '2026-01-20',
                        'Official Ref' => 'RG-POS-2026-0120'
                    ]
                ]
            ],
            [
                'class' => null, // Stored in inventory_items
                'file_name' => 'SALES_KM_2026_001.jpg',
                'title' => 'Knoah Mari Branch Front Desk Sales Summary',
                'establishment' => 'Knoah Mari Trading & Services',
                'receipt_date' => '2026-01-22',
                'description' => 'Customer Front Counter Cash Sales Settlement',
                'category' => 'Sales',
                'category_id' => 'sales',
                'sub_category' => 'Knoah Mari Sales 2026',
                'sub_category_id' => 'knoah-mari-sales-2026',
                'entity' => 'Knoah Mari',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 4200.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'batch',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Knoah Mari Trading & Services',
                    'receipt_date' => '2026-01-22',
                    'description' => 'Customer Front Counter Cash Sales Settlement',
                    'amount' => 4200.00,
                    'or_number' => 'KM-CS-2026-0122',
                    'summary' => [
                        'Establishment' => 'Knoah Mari Trading & Services',
                        'Total Amount' => 'PHP 4,200.00',
                        'Receipt Date' => '2026-01-22',
                        'Official Ref' => 'KM-CS-2026-0122'
                    ]
                ]
            ],
        ];

        // 2. INCOME MOCK DATA
        $incomeData = [
            [
                'class' => null,
                'file_name' => 'INC_PETC_2026_001.jpg',
                'title' => 'PETC Daily Revenue Collection & Bank Remittance',
                'establishment' => 'BDO Unibank - Gorordo Branch',
                'receipt_date' => '2026-01-18',
                'description' => 'Daily Inspection Collections Bank Deposit Slip',
                'category' => 'Income',
                'category_id' => 'income',
                'sub_category' => 'Income 2026 (PETC)',
                'sub_category_id' => 'income-2026-petc',
                'entity' => 'PETC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 15500.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'deposit',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'BDO Unibank - Gorordo Branch',
                    'receipt_date' => '2026-01-18',
                    'description' => 'Daily Inspection Collections Bank Deposit Slip',
                    'amount' => 15500.00,
                    'or_number' => 'BDO-DEP-49012',
                    'summary' => [
                        'Establishment' => 'BDO Unibank - Gorordo Branch',
                        'Total Amount' => 'PHP 15,500.00',
                        'Receipt Date' => '2026-01-18',
                        'Official Ref' => 'BDO-DEP-49012'
                    ]
                ]
            ],
            [
                'class' => null,
                'file_name' => 'INC_RG_2026_001.jpg',
                'title' => 'Red Goose Store Daily Remittance & Deposit',
                'establishment' => 'Metrobank - Highway Branch',
                'receipt_date' => '2026-01-19',
                'description' => 'Store Operations Daily Cash Turnover & Deposit',
                'category' => 'Income',
                'category_id' => 'income',
                'sub_category' => 'Red Goose Income 2026',
                'sub_category_id' => 'red-goose-income-2026',
                'entity' => 'Red Goose',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 12800.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'deposit',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Metrobank - Highway Branch',
                    'receipt_date' => '2026-01-19',
                    'description' => 'Store Operations Daily Cash Turnover & Deposit',
                    'amount' => 12800.00,
                    'or_number' => 'MB-DEP-77319',
                    'summary' => [
                        'Establishment' => 'Metrobank - Highway Branch',
                        'Total Amount' => 'PHP 12,800.00',
                        'Receipt Date' => '2026-01-19',
                        'Official Ref' => 'MB-DEP-77319'
                    ]
                ]
            ],
            [
                'class' => null,
                'file_name' => 'INC_KM_2026_001.jpg',
                'title' => 'Knoah Mari Branch Operating Revenue Deposit',
                'establishment' => 'Landbank - Cebu South Branch',
                'receipt_date' => '2026-01-21',
                'description' => 'Weekly Branch Revenue Remittance Slip',
                'category' => 'Income',
                'category_id' => 'income',
                'sub_category' => 'Knoah Mari Income 2026',
                'sub_category_id' => 'knoah-mari-income-2026',
                'entity' => 'Knoah Mari',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 9450.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'deposit',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Landbank - Cebu South Branch',
                    'receipt_date' => '2026-01-21',
                    'description' => 'Weekly Branch Revenue Remittance Slip',
                    'amount' => 9450.00,
                    'or_number' => 'LBP-DEP-11928',
                    'summary' => [
                        'Establishment' => 'Landbank - Cebu South Branch',
                        'Total Amount' => 'PHP 9,450.00',
                        'Receipt Date' => '2026-01-21',
                        'Official Ref' => 'LBP-DEP-11928'
                    ]
                ]
            ],
        ];

        // 3. EXPENSES MOCK DATA
        $expensesData = [
            [
                'class' => PetcExpenseReceipt::class,
                'file_name' => 'EXP_PETC_2026_001.jpg',
                'title' => 'PETC Opacity Meter Sensor Calibration Service',
                'establishment' => 'Precision Calibration Works',
                'receipt_date' => '2026-01-10',
                'description' => 'Annual Sensor Recalibration and Testing Certification',
                'category' => 'Expenses',
                'category_id' => 'expenses',
                'sub_category' => 'Expenses 2026 (PETC)',
                'sub_category_id' => 'expenses-2026-petc',
                'entity' => 'PETC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 3500.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'service',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Precision Calibration Works',
                    'receipt_date' => '2026-01-10',
                    'description' => 'Annual Sensor Recalibration and Testing Certification',
                    'amount' => 3500.00,
                    'or_number' => 'CAL-2026-991',
                    'summary' => [
                        'Establishment' => 'Precision Calibration Works',
                        'Total Amount' => 'PHP 3,500.00',
                        'Receipt Date' => '2026-01-10',
                        'Official Ref' => 'CAL-2026-991'
                    ]
                ]
            ],
            [
                'class' => RedGooseExpenseReceipt::class,
                'file_name' => 'EXP_RG_2026_001.jpg',
                'title' => 'Kitchen LPG Gas Tank Refill (2x 50kg)',
                'establishment' => 'Solane Gas Trading',
                'receipt_date' => '2026-01-14',
                'description' => 'Commercial LPG Cylinder Refills for Main Kitchen Stove',
                'category' => 'Expenses',
                'category_id' => 'expenses',
                'sub_category' => 'Red Goose Expenses 2026',
                'sub_category_id' => 'red-goose-2026',
                'entity' => 'Red Goose',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 4600.00,
                'currency' => 'PHP',
                'quantity' => 2.00,
                'unit' => 'tank',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Solane Gas Trading',
                    'receipt_date' => '2026-01-14',
                    'description' => 'Commercial LPG Cylinder Refills for Main Kitchen Stove',
                    'amount' => 4600.00,
                    'or_number' => 'SOL-55421',
                    'summary' => [
                        'Establishment' => 'Solane Gas Trading',
                        'Total Amount' => 'PHP 4,600.00',
                        'Receipt Date' => '2026-01-14',
                        'Official Ref' => 'SOL-55421'
                    ]
                ]
            ],
            [
                'class' => KnoahMariExpenseReceipt::class,
                'file_name' => 'EXP_KM_2026_001.jpg',
                'title' => 'Monthly Facility Electricity and Power Bill',
                'establishment' => 'VECO Visayan Electric Company',
                'receipt_date' => '2026-01-16',
                'description' => 'Branch Facility Commercial Electric Power Billing',
                'category' => 'Expenses',
                'category_id' => 'expenses',
                'sub_category' => 'Knoah Mari Expenses 2026',
                'sub_category_id' => 'knoah-mari-2026',
                'entity' => 'Knoah Mari',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 5820.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'bill',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'VECO Visayan Electric Company',
                    'receipt_date' => '2026-01-16',
                    'description' => 'Branch Facility Commercial Electric Power Billing',
                    'amount' => 5820.00,
                    'or_number' => 'VEC-908123',
                    'summary' => [
                        'Establishment' => 'VECO Visayan Electric Company',
                        'Total Amount' => 'PHP 5,820.00',
                        'Receipt Date' => '2026-01-16',
                        'Official Ref' => 'VEC-908123'
                    ]
                ]
            ],
        ];

        // 4. CONSUMABLES MOCK DATA (Complete 9 columns in preview_data)
        $consumablesData = [
            [
                'class' => ConsumablesReceipt::class,
                'file_name' => 'CNS_PETC_PAPER_001.item',
                'title' => 'A4 Copy Paper 80gsm (Box of 5 Reams)',
                'establishment' => 'National Book Store',
                'receipt_date' => '2026-01-12',
                'description' => 'Multi-purpose copier and testing report paper',
                'category' => 'Consumables',
                'category_id' => 'consumables',
                'sub_category' => 'Office supplies',
                'sub_category_id' => 'petc-office-supplies',
                'entity' => 'PETC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 1400.00,
                'currency' => 'PHP',
                'quantity' => 5.00,
                'unit' => 'reams',
                'status' => 'In Stock',
                'preview_data' => [
                    'itemNo' => '1',
                    'item_no' => '1',
                    'date' => '2026-01-12',
                    'receipt_date' => '2026-01-12',
                    'particulars' => 'A4 Copy Paper 80gsm (Box of 5 Reams)',
                    'supplier' => 'National Book Store',
                    'establishment' => 'National Book Store',
                    'orSiNo' => 'SI-89021',
                    'or_si_no' => 'SI-89021',
                    'quantity' => 5,
                    'unitMeasure' => 'reams',
                    'unit' => 'reams',
                    'unitCost' => 280.00,
                    'unit_cost' => 280.00,
                    'amount' => 1400.00,
                    'notes' => 'Stocked for PETC Emission Testing Reports',
                    'status' => 'In Stock',
                    'summary' => [
                        'Item No' => '1',
                        'Particulars' => 'A4 Copy Paper 80gsm (Box of 5 Reams)',
                        'Supplier' => 'National Book Store',
                        'OR / SI No.' => 'SI-89021',
                        'Qty' => '5',
                        'Unit' => 'reams',
                        'Unit Cost' => '₱280.00',
                        'Amount' => '₱1,400.00'
                    ]
                ]
            ],
            [
                'class' => ConsumablesReceipt::class,
                'file_name' => 'CNS_KM_BLEACH_001.item',
                'title' => 'Industrial Multi-surface Bleach & Floor Disinfectant',
                'establishment' => 'Puregold Price Club',
                'receipt_date' => '2026-01-13',
                'description' => 'Store sanitation, floor cleaning and surface disinfection solution',
                'category' => 'Consumables',
                'category_id' => 'consumables',
                'sub_category' => 'Store Consumables',
                'sub_category_id' => 'knoah-mari-store-consumables',
                'entity' => 'Knoah Mari',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 1050.00,
                'currency' => 'PHP',
                'quantity' => 3.00,
                'unit' => 'gallons',
                'status' => 'In Stock',
                'preview_data' => [
                    'itemNo' => '1',
                    'item_no' => '1',
                    'date' => '2026-01-13',
                    'receipt_date' => '2026-01-13',
                    'particulars' => 'Industrial Multi-surface Bleach & Floor Disinfectant',
                    'supplier' => 'Puregold Price Club',
                    'establishment' => 'Puregold Price Club',
                    'orSiNo' => 'OR-67412',
                    'or_si_no' => 'OR-67412',
                    'quantity' => 3,
                    'unitMeasure' => 'gallons',
                    'unit' => 'gallons',
                    'unitCost' => 350.00,
                    'unit_cost' => 350.00,
                    'amount' => 1050.00,
                    'notes' => 'Store Cleaning Supplies',
                    'status' => 'In Stock',
                    'summary' => [
                        'Item No' => '1',
                        'Particulars' => 'Industrial Multi-surface Bleach & Floor Disinfectant',
                        'Supplier' => 'Puregold Price Club',
                        'OR / SI No.' => 'OR-67412',
                        'Qty' => '3',
                        'Unit' => 'gallons',
                        'Unit Cost' => '₱350.00',
                        'Amount' => '₱1,050.00'
                    ]
                ]
            ],
            [
                'class' => ConsumablesReceipt::class,
                'file_name' => 'CNS_RG_BAGS_001.item',
                'title' => 'Heavy Duty Trash Bags XXL Black (Pack of 100)',
                'establishment' => 'SM Hypermarket Wholesale',
                'receipt_date' => '2026-01-14',
                'description' => 'Commercial kitchen refuse and heavy trash disposal liners',
                'category' => 'Consumables',
                'category_id' => 'consumables',
                'sub_category' => 'Store Consumables',
                'sub_category_id' => 'red-goose-store-consumables',
                'entity' => 'Red Goose',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 1440.00,
                'currency' => 'PHP',
                'quantity' => 8.00,
                'unit' => 'packs',
                'status' => 'In Stock',
                'preview_data' => [
                    'itemNo' => '1',
                    'item_no' => '1',
                    'date' => '2026-01-14',
                    'receipt_date' => '2026-01-14',
                    'particulars' => 'Heavy Duty Trash Bags XXL Black (Pack of 100)',
                    'supplier' => 'SM Hypermarket Wholesale',
                    'establishment' => 'SM Hypermarket Wholesale',
                    'orSiNo' => 'SI-33910',
                    'or_si_no' => 'SI-33910',
                    'quantity' => 8,
                    'unitMeasure' => 'packs',
                    'unit' => 'packs',
                    'unitCost' => 180.00,
                    'unit_cost' => 180.00,
                    'amount' => 1440.00,
                    'notes' => 'Kitchen Cleaning & Disposal Supplies',
                    'status' => 'In Stock',
                    'summary' => [
                        'Item No' => '1',
                        'Particulars' => 'Heavy Duty Trash Bags XXL Black (Pack of 100)',
                        'Supplier' => 'SM Hypermarket Wholesale',
                        'OR / SI No.' => 'SI-33910',
                        'Qty' => '8',
                        'Unit' => 'packs',
                        'Unit Cost' => '₱180.00',
                        'Amount' => '₱1,440.00'
                    ]
                ]
            ],
        ];

        // 5. VOUCHERS MOCK DATA
        $vouchersData = [
            [
                'class' => VoucherReceipt::class,
                'file_name' => 'VCH_PETC_2026_001.jpg',
                'title' => 'Petty Cash Voucher - LBC Express Courier Delivery',
                'establishment' => 'LBC Express Courier',
                'receipt_date' => '2026-01-11',
                'description' => 'Courier fee for sending documents to LTO central office',
                'category' => 'Vouchers',
                'category_id' => 'vouchers',
                'sub_category' => 'PETC',
                'sub_category_id' => 'vouchers-petc',
                'entity' => 'PETC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 350.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'voucher',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'LBC Express Courier',
                    'receipt_date' => '2026-01-11',
                    'description' => 'Courier fee for sending documents to LTO central office',
                    'amount' => 350.00,
                    'or_number' => 'VCH-PETC-011',
                    'summary' => [
                        'Establishment' => 'LBC Express Courier',
                        'Total Amount' => 'PHP 350.00',
                        'Receipt Date' => '2026-01-11',
                        'Official Ref' => 'VCH-PETC-011'
                    ]
                ]
            ],
            [
                'class' => VoucherReceipt::class,
                'file_name' => 'VCH_STC_2026_001.jpg',
                'title' => 'Petty Cash Voucher - Training Seminar Venue Deposit',
                'establishment' => 'STC Skills Training Foundation',
                'receipt_date' => '2026-01-15',
                'description' => 'Advance venue setup and refreshment voucher',
                'category' => 'Vouchers',
                'category_id' => 'vouchers',
                'sub_category' => 'STC',
                'sub_category_id' => 'vouchers-stc',
                'entity' => 'STC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 1200.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'voucher',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'STC Skills Training Foundation',
                    'receipt_date' => '2026-01-15',
                    'description' => 'Advance venue setup and refreshment voucher',
                    'amount' => 1200.00,
                    'or_number' => 'VCH-STC-015',
                    'summary' => [
                        'Establishment' => 'STC Skills Training Foundation',
                        'Total Amount' => 'PHP 1,200.00',
                        'Receipt Date' => '2026-01-15',
                        'Official Ref' => 'VCH-STC-015'
                    ]
                ]
            ],
            [
                'class' => VoucherReceipt::class,
                'file_name' => 'VCH_KM_2026_001.jpg',
                'title' => 'Petty Cash Voucher - Employee Local Transportation Liquidation',
                'establishment' => 'Knoah Mari Operations',
                'receipt_date' => '2026-01-17',
                'description' => 'Transportation fare reimbursement for offsite client inspection',
                'category' => 'Vouchers',
                'category_id' => 'vouchers',
                'sub_category' => 'Knoah Mari',
                'sub_category_id' => 'vouchers-knoah-mari',
                'entity' => 'Knoah Mari',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 480.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'voucher',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Knoah Mari Operations',
                    'receipt_date' => '2026-01-17',
                    'description' => 'Transportation fare reimbursement for offsite client inspection',
                    'amount' => 480.00,
                    'or_number' => 'VCH-KM-017',
                    'summary' => [
                        'Establishment' => 'Knoah Mari Operations',
                        'Total Amount' => 'PHP 480.00',
                        'Receipt Date' => '2026-01-17',
                        'Official Ref' => 'VCH-KM-017'
                    ]
                ]
            ],
            [
                'class' => VoucherReceipt::class,
                'file_name' => 'VCH_RG_2026_001.jpg',
                'title' => 'Petty Cash Voucher - Emergency Kitchen Plumbing Repair',
                'establishment' => 'Cebu Rapid Plumbing & Hardware',
                'receipt_date' => '2026-01-23',
                'description' => 'Emergency grease trap and drain pipe repair service voucher',
                'category' => 'Vouchers',
                'category_id' => 'vouchers',
                'sub_category' => 'Red Goose',
                'sub_category_id' => 'vouchers-red-goose',
                'entity' => 'Red Goose',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 950.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'voucher',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Cebu Rapid Plumbing & Hardware',
                    'receipt_date' => '2026-01-23',
                    'description' => 'Emergency grease trap and drain pipe repair service voucher',
                    'amount' => 950.00,
                    'or_number' => 'VCH-RG-023',
                    'summary' => [
                        'Establishment' => 'Cebu Rapid Plumbing & Hardware',
                        'Total Amount' => 'PHP 950.00',
                        'Receipt Date' => '2026-01-23',
                        'Official Ref' => 'VCH-RG-023'
                    ]
                ]
            ],
        ];

        // 6. PETC INSURANCE MOCK DATA
        $insuranceData = [
            [
                'class' => PetcInsuranceReceipt::class,
                'file_name' => 'INS_CTPL_2026_001.jpg',
                'title' => 'CTPL Comprehensive Vehicle Insurance Policy - MVIR #88412',
                'establishment' => 'Alpha Insurance & Guarantee Co.',
                'receipt_date' => '2026-01-08',
                'description' => 'Compulsory Third Party Liability Vehicle Insurance Certificate',
                'category' => 'PETC Insurance',
                'category_id' => 'petc-insurance',
                'sub_category' => 'CTPL Insurance',
                'sub_category_id' => 'ctpl-insurance',
                'entity' => 'PETC',
                'year' => '2026',
                'month' => 'JAN',
                'amount' => 1150.00,
                'currency' => 'PHP',
                'quantity' => 1.00,
                'unit' => 'policy',
                'status' => 'Scanned & Verified',
                'preview_data' => [
                    'establishment' => 'Alpha Insurance & Guarantee Co.',
                    'receipt_date' => '2026-01-08',
                    'description' => 'CTPL Compulsory Third Party Liability Insurance',
                    'amount' => 1150.00,
                    'or_number' => 'POL-CTPL-2026-88',
                    'summary' => [
                        'Establishment' => 'Alpha Insurance & Guarantee Co.',
                        'Total Amount' => 'PHP 1,150.00',
                        'Receipt Date' => '2026-01-08',
                        'Official Ref' => 'POL-CTPL-2026-88'
                    ]
                ]
            ]
        ];

        $allCategories = [
            $salesData,
            $incomeData,
            $expensesData,
            $consumablesData,
            $vouchersData,
            $insuranceData,
        ];

        foreach ($allCategories as $categoryList) {
            foreach ($categoryList as $item) {
                $class = $item['class'] ?? null;
                unset($item['class']);

                // Find existing record by file_name in inventory_items to preserve ID or create a new one
                $existing = InventoryItem::where('file_name', $item['file_name'])->first();
                $recordId = $existing ? $existing->id : 'MOCK-' . Str::upper(Str::random(12));

                $attributes = array_merge([
                    'id' => $recordId,
                    'user_id' => $adminId,
                    'currency' => 'PHP',
                    'quantity' => 1.00,
                    'unit' => 'receipt',
                    'status' => 'Scanned & Verified',
                    'file_format' => str_ends_with($item['file_name'], '.item') ? 'ITEM' : 'JPG',
                    'file_size' => '85 KB',
                    'file_path' => null,
                    'notes' => 'Mock folder record for ' . ($item['sub_category'] ?? $item['category']),
                    'tags' => [$item['entity'], $item['category'], 'MockData'],
                    'scanned_at' => now(),
                ], $item);

                // Insert or update in dedicated table if class exists
                if ($class) {
                    $class::updateOrCreate(['file_name' => $item['file_name']], $attributes);
                }

                // Always insert or update in master inventory_items
                InventoryItem::updateOrCreate(['file_name' => $item['file_name']], $attributes);
            }
        }

        // Also ensure any existing records in inventory_items have sub_category_id populated if matching
        InventoryItem::where('sub_category', 'Expenses 2026 (PETC)')->whereNull('sub_category_id')->update(['sub_category_id' => 'expenses-2026-petc']);
        InventoryItem::where('sub_category', 'Red Goose Expenses 2026')->whereNull('sub_category_id')->update(['sub_category_id' => 'red-goose-2026']);
        InventoryItem::where('sub_category', 'Knoah Mari Expenses 2026')->whereNull('sub_category_id')->update(['sub_category_id' => 'knoah-mari-2026']);

        // Invalidate receipt cache
        app(ReceiptService::class)->invalidateReceiptCache();

        $this->command->info('All folder mock data successfully seeded and cache invalidated!');
    }
}
