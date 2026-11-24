<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Throwable;

class ExportSupabaseData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'km100:export-supabase
                            {--dest= : Target directory path (defaults to storage/app/migration)}
                            {--url= : Supabase project URL}
                            {--key= : Supabase anon or service key}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Safely and securely export all tables from Supabase PostgreSQL to an auditable local JSON dump';

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
    public function handle(): int
    {
        $this->info('Starting Secure Supabase PostgreSQL Data Export...');

        $supabaseUrl = $this->option('url') ?: env('SUPABASE_URL', 'https://vgiqeackhpxhmyozlcux.supabase.co');
        $supabaseKey = $this->option('key') ?: env('SUPABASE_KEY', 'sb_publishable_kDWsZKe-UHiM_uaDTygtCg_72YO3_cP');

        $targetDir = $this->option('dest') ?: storage_path('app/migration');
        if (!File::exists($targetDir)) {
            File::makeDirectory($targetDir, 0755, true);
        }

        $timestamp = now()->format('Ymd_His');
        $exportPayload = [
            'metadata' => [
                'exported_at' => now()->toIso8601String(),
                'source_url' => parse_url($supabaseUrl, PHP_URL_HOST),
                'system' => 'KM100 MacroSync',
            ],
            'tables' => [],
            'summary' => [],
        ];

        $cleanUrl = rtrim($supabaseUrl, '/') . '/rest/v1';
        $totalRecords = 0;

        foreach ($this->tables as $table) {
            $this->line("Exporting table: <comment>{$table}</comment>...");

            try {
                $response = Http::withHeaders([
                    'apikey' => $supabaseKey,
                    'Authorization' => "Bearer {$supabaseKey}",
                    'Prefer' => 'count=exact',
                ])->timeout(60)->get("{$cleanUrl}/{$table}?select=*");

                if ($response->successful()) {
                    $rows = $response->json();
                    $rowCount = is_array($rows) ? count($rows) : 0;
                    $totalRecords += $rowCount;

                    $exportPayload['tables'][$table] = $rows;
                    $exportPayload['summary'][$table] = [
                        'record_count' => $rowCount,
                        'status' => 'success',
                        'http_status' => $response->status(),
                    ];

                    $this->info("  -> [{$table}]: Exported {$rowCount} records.");
                } else {
                    $exportPayload['tables'][$table] = [];
                    $exportPayload['summary'][$table] = [
                        'record_count' => 0,
                        'status' => 'failed',
                        'http_status' => $response->status(),
                        'error' => $response->body(),
                    ];
                    $this->warn("  -> [{$table}]: Failed with HTTP {$response->status()}");
                }
            } catch (Throwable $e) {
                $exportPayload['tables'][$table] = [];
                $exportPayload['summary'][$table] = [
                    'record_count' => 0,
                    'status' => 'error',
                    'error' => $e->getMessage(),
                ];
                $this->error("  -> [{$table}]: Exception {$e->getMessage()}");
            }
        }

        $exportPayload['metadata']['total_records'] = $totalRecords;

        $fileName = "supabase_export_{$timestamp}.json";
        $filePath = "{$targetDir}/{$fileName}";

        File::put($filePath, json_encode($exportPayload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $checksum = hash_file('sha256', $filePath);
        $fileSizeKb = round(File::size($filePath) / 1024, 2);

        $this->newLine();
        $this->info("Export Complete!");
        $this->table(['Metric', 'Value'], [
            ['File Name', $fileName],
            ['File Path', $filePath],
            ['File Size', "{$fileSizeKb} KB"],
            ['SHA-256 Checksum', $checksum],
            ['Total Records', $totalRecords],
        ]);

        return 0;
    }
}
