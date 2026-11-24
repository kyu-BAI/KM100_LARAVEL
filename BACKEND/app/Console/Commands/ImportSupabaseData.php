<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\ReceiptService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Throwable;

class ImportSupabaseData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'km100:import-supabase
                            {--file= : Optional path to a JSON file containing exported Supabase rows}
                            {--url= : Supabase project URL (defaults to configured URL)}
                            {--key= : Supabase service or anon key}
                            {--dry-run : Simulate the migration without committing database transactions}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely import and sync records from Supabase into local MySQL database with transaction safety and audit tracking';

    protected array $tables = [
        'inventory_items',
        'petc_sales_receipts',
        'petc_insurance_receipts',
        'petc_expense_receipts',
        'red_goose_expense_receipts',
        'knoah_mari_expense_receipts',
        'consumables_receipts',
        'voucher_receipts',
    ];

    /**
     * Execute the console command.
     */
    public function handle(ReceiptService $receiptService): int
    {
        $isDryRun = $this->option('dry-run');
        if ($isDryRun) {
            $this->warn('DRY-RUN MODE: Database modifications will not be committed.');
        }

        $this->info('Starting Supabase-to-MySQL Data Migration...');
        $filePath = $this->option('file');

        $metrics = [
            'total_processed' => 0,
            'created' => 0,
            'updated' => 0,
            'failed' => 0,
            'skipped' => 0,
        ];

        $results = [];

        // Step 1: Ensure parent dependency (Admin & System users exist)
        $this->ensureParentUsersExist();

        if (!empty($filePath)) {
            if (!file_exists($filePath)) {
                $this->error("Specified file not found: [{$filePath}]");
                return 1;
            }

            $content = file_get_contents($filePath);
            $data = json_decode($content, true);

            if (!is_array($data)) {
                $this->error("Invalid JSON format in file: [{$filePath}]");
                return 1;
            }

            $sourceTables = $data['tables'] ?? $data;
            $this->info("Importing records from JSON file: [{$filePath}]");
            $results = $this->importFromStructuredData($sourceTables, $receiptService, $metrics, $isDryRun);
        } else {
            $supabaseUrl = $this->option('url') ?: env('SUPABASE_URL', 'https://vgiqeackhpxhmyozlcux.supabase.co');
            $supabaseKey = $this->option('key') ?: env('SUPABASE_KEY', 'sb_publishable_kDWsZKe-UHiM_uaDTygtCg_72YO3_cP');

            $this->info("Connecting to Supabase REST API at: {$supabaseUrl}");
            $results = $this->importFromApi($supabaseUrl, $supabaseKey, $receiptService, $metrics, $isDryRun);
        }

        // Render summary table
        $tableRows = [];
        $totalImported = 0;

        foreach ($this->tables as $table) {
            $modelClass = $receiptService->resolveModelClass($table);
            $currentCount = $modelClass::count();
            $tableMetrics = $results[$table] ?? ['created' => 0, 'updated' => 0, 'failed' => 0];
            $importedCount = ($tableMetrics['created'] ?? 0) + ($tableMetrics['updated'] ?? 0);
            $totalImported += $importedCount;

            $tableRows[] = [
                $table,
                $tableMetrics['created'] ?? 0,
                $tableMetrics['updated'] ?? 0,
                $tableMetrics['failed'] ?? 0,
                $currentCount,
                $tableMetrics['failed'] === 0 ? '<info>Verified</info>' : '<error>Failed Rows</error>',
            ];
        }

        $this->newLine();
        $this->table(['Table Name', 'Created', 'Updated', 'Failed', 'Total in MySQL', 'Status'], $tableRows);

        $this->newLine();
        $this->info("Migration Execution Summary:");
        $this->table(['Metric', 'Count'], [
            ['Total Processed', $metrics['total_processed']],
            ['New Records Created', $metrics['created']],
            ['Existing Records Synced', $metrics['updated']],
            ['Failed Records', $metrics['failed']],
            ['Skipped Records', $metrics['skipped']],
        ]);

        if (!$isDryRun) {
            $receiptService->invalidateReceiptCache();
            $this->info("Database query caches invalidated successfully.");
        }

        return $metrics['failed'] === 0 ? 0 : 1;
    }

    /**
     * Ensure baseline parent user records exist to prevent FK violations.
     */
    protected function ensureParentUsersExist(): void
    {
        if (User::count() === 0) {
            $this->info('Parent user table is empty. Running user seeders...');
            $this->call('db:seed', ['--class' => 'AdminUserSeeder', '--force' => true]);
            $this->call('db:seed', ['--class' => 'EmployeeUserSeeder', '--force' => true]);
        }
    }

    /**
     * Import records from structured data (table-grouped or flat).
     */
    protected function importFromStructuredData(array $data, ReceiptService $receiptService, array &$metrics, bool $isDryRun): array
    {
        $tableResults = [];

        // If flat list
        if (isset($data[0])) {
            $this->info("Processing flat list of " . count($data) . " records...");
            foreach ($data as $row) {
                $table = $row['sourceTable'] ?? $row['table'] ?? 'inventory_items';
                if (!in_array($table, $this->tables)) {
                    $table = 'inventory_items';
                }
                $this->processRow($receiptService, $table, $row, $tableResults, $metrics, $isDryRun);
            }
        } else {
            // Grouped by table
            foreach ($this->tables as $table) {
                $rows = $data[$table] ?? [];
                if (!is_array($rows)) {
                    continue;
                }
                $this->line("Processing table: <comment>{$table}</comment> (" . count($rows) . " records)...");
                DB::beginTransaction();
                try {
                    foreach ($rows as $row) {
                        $this->processRow($receiptService, $table, $row, $tableResults, $metrics, $isDryRun);
                    }
                    if ($isDryRun) {
                        DB::rollBack();
                    } else {
                        DB::commit();
                    }
                } catch (Throwable $e) {
                    DB::rollBack();
                    $this->error("Transaction rolled back for table [{$table}]: {$e->getMessage()}");
                }
            }
        }

        return $tableResults;
    }

    /**
     * Import records directly from Supabase PostgREST API endpoints.
     */
    protected function importFromApi(string $url, string $key, ReceiptService $receiptService, array &$metrics, bool $isDryRun): array
    {
        $tableResults = [];
        $cleanUrl = rtrim($url, '/') . '/rest/v1';

        foreach ($this->tables as $table) {
            $this->line("Fetching table: <comment>{$table}</comment>...");
            try {
                $response = Http::withHeaders([
                    'apikey' => $key,
                    'Authorization' => "Bearer {$key}",
                ])->timeout(60)->get("{$cleanUrl}/{$table}?select=*");

                if ($response->successful()) {
                    $rows = $response->json();
                    if (is_array($rows)) {
                        DB::beginTransaction();
                        try {
                            foreach ($rows as $row) {
                                $this->processRow($receiptService, $table, $row, $tableResults, $metrics, $isDryRun);
                            }
                            if ($isDryRun) {
                                DB::rollBack();
                            } else {
                                DB::commit();
                            }
                        } catch (Throwable $e) {
                            DB::rollBack();
                            $this->error("Transaction failed on [{$table}]: {$e->getMessage()}");
                        }
                    }
                } else {
                    $this->warn("  -> Table {$table}: HTTP {$response->status()} - Skipping remote query.");
                }
            } catch (Throwable $e) {
                $this->warn("  -> Table {$table}: Connection error ({$e->getMessage()})");
            }
        }

        return $tableResults;
    }

    /**
     * Process an individual row with transformation and error handling.
     */
    protected function processRow(ReceiptService $receiptService, string $table, array $row, array &$tableResults, array &$metrics, bool $isDryRun): void
    {
        $metrics['total_processed']++;
        if (!isset($tableResults[$table])) {
            $tableResults[$table] = ['created' => 0, 'updated' => 0, 'failed' => 0];
        }

        try {
            $modelClass = $receiptService->resolveModelClass($table);
            $id = $row['id'] ?? null;
            if (!$id) {
                $metrics['skipped']++;
                return;
            }

            // Resolve foreign key: verify user_id exists if specified
            $userId = $row['user_id'] ?? null;
            if ($userId && !User::where('id', $userId)->exists()) {
                // Safe handling: Set null rather than violating foreign key
                $userId = null;
            }

            $attributes = [
                'user_id' => $userId,
                'file_name' => $row['file_name'] ?? $row['fileName'] ?? 'document.jpg',
                'title' => $row['title'] ?? $row['file_name'] ?? $row['fileName'] ?? null,
                'establishment' => $row['establishment'] ?? null,
                'receipt_date' => $row['receipt_date'] ?? $row['receiptDate'] ?? null,
                'description' => $row['description'] ?? null,
                'category' => $row['category'] ?? null,
                'category_id' => $row['category_id'] ?? $row['categoryId'] ?? null,
                'sub_category' => $row['sub_category'] ?? $row['subCategory'] ?? null,
                'sub_category_id' => $row['sub_category_id'] ?? $row['subCategoryId'] ?? null,
                'entity' => $row['entity'] ?? 'PETC',
                'year' => isset($row['year']) ? (string) $row['year'] : null,
                'month' => isset($row['month']) ? strtoupper((string) $row['month']) : null,
                'amount' => (float) ($row['amount'] ?? 0),
                'currency' => $row['currency'] ?? 'PHP',
                'quantity' => (float) ($row['quantity'] ?? 1),
                'unit' => $row['unit'] ?? 'receipt',
                'status' => $row['status'] ?? 'Active',
                'file_format' => $row['file_format'] ?? $row['fileFormat'] ?? 'JPG',
                'file_size' => $row['file_size'] ?? $row['fileSize'] ?? '0 KB',
                'file_path' => $row['file_path'] ?? $row['filePath'] ?? null,
                'notes' => $row['notes'] ?? null,
                'tags' => is_array($row['tags'] ?? null) ? $row['tags'] : [],
                'preview_data' => is_array($row['preview_data'] ?? null) ? $row['preview_data'] : ($row['previewData'] ?? null),
                'scanned_at' => $row['scanned_at'] ?? $row['scannedDate'] ?? null,
            ];

            $exists = $modelClass::where('id', $id)->exists();

            if (!$isDryRun) {
                $modelClass::updateOrCreate(['id' => $id], $attributes);

                // DUAL-STORAGE RULE: If imported to dedicated table, ensure mirror in inventory_items
                if ($table !== 'inventory_items') {
                    \App\Models\InventoryItem::updateOrCreate(['id' => $id], $attributes);
                }
            }

            if ($exists) {
                $metrics['updated']++;
                $tableResults[$table]['updated']++;
            } else {
                $metrics['created']++;
                $tableResults[$table]['created']++;
            }
        } catch (Throwable $e) {
            $metrics['failed']++;
            $tableResults[$table]['failed']++;
            $this->error("Error importing row [{$id}] into [{$table}]: {$e->getMessage()}");
        }
    }
}
