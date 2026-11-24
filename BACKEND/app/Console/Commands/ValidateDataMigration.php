<?php

namespace App\Console\Commands;

use App\Services\ReceiptService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Throwable;

class ValidateDataMigration extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'km100:validate-migration
                            {--file= : Optional path to exported JSON file instead of live API}
                            {--url= : Supabase project URL}
                            {--key= : Supabase key}
                            {--report= : Optional path to save validation JSON report}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Perform exhaustive validation between Supabase source and MySQL target database';

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
        $this->info('Starting In-Depth Data Migration Validation...');

        $filePath = $this->option('file');
        $sourceData = [];

        if (!empty($filePath)) {
            if (!File::exists($filePath)) {
                $this->error("Export file not found: [{$filePath}]");
                return 1;
            }
            $content = json_decode(File::get($filePath), true);
            $sourceData = $content['tables'] ?? $content;
            $this->info("Loaded source records from export file: [{$filePath}]");
        } else {
            $supabaseUrl = $this->option('url') ?: env('SUPABASE_URL', 'https://vgiqeackhpxhmyozlcux.supabase.co');
            $supabaseKey = $this->option('key') ?: env('SUPABASE_KEY', 'sb_publishable_kDWsZKe-UHiM_uaDTygtCg_72YO3_cP');
            $cleanUrl = rtrim($supabaseUrl, '/') . '/rest/v1';

            $this->info("Fetching live source records from Supabase: {$supabaseUrl}...");
            foreach ($this->tables as $table) {
                try {
                    $res = Http::withHeaders([
                        'apikey' => $supabaseKey,
                        'Authorization' => "Bearer {$supabaseKey}",
                        'Prefer' => 'count=exact',
                    ])->timeout(60)->get("{$cleanUrl}/{$table}?select=*");

                    if ($res->successful()) {
                        $sourceData[$table] = $res->json() ?: [];
                    } else {
                        $sourceData[$table] = [];
                        $this->warn("Could not query {$table}: HTTP {$res->status()}");
                    }
                } catch (Throwable $e) {
                    $sourceData[$table] = [];
                    $this->error("Connection error on {$table}: {$e->getMessage()}");
                }
            }
        }

        $auditReport = [
            'validated_at' => now()->toIso8601String(),
            'total_source_records' => 0,
            'total_mysql_records' => 0,
            'tables' => [],
            'integrity_checks' => [
                'primary_keys_matched' => 0,
                'primary_keys_missing' => 0,
                'amount_mismatches' => 0,
                'json_payload_valid' => 0,
                'unresolved_foreign_keys' => 0,
            ],
            'issues' => [],
        ];

        $summaryTable = [];

        foreach ($this->tables as $table) {
            $sourceRows = $sourceData[$table] ?? [];
            $sourceCount = count($sourceRows);
            $auditReport['total_source_records'] += $sourceCount;

            $modelClass = $receiptService->resolveModelClass($table);
            $mysqlRows = $modelClass::all()->keyBy('id');
            $mysqlCount = $mysqlRows->count();
            $auditReport['total_mysql_records'] += $mysqlCount;

            $tableMatched = 0;
            $tableMissing = 0;
            $tableIssues = [];

            foreach ($sourceRows as $sRow) {
                $id = $sRow['id'] ?? null;
                if (!$id) {
                    $tableIssues[] = ['type' => 'missing_id', 'record' => $sRow];
                    continue;
                }

                if (!$mysqlRows->has($id)) {
                    $tableMissing++;
                    $auditReport['integrity_checks']['primary_keys_missing']++;
                    $tableIssues[] = ['type' => 'missing_record', 'id' => $id];
                    continue;
                }

                $tableMatched++;
                $auditReport['integrity_checks']['primary_keys_matched']++;
                $mRow = $mysqlRows->get($id);

                // Check amount parity
                $sAmt = (float) ($sRow['amount'] ?? 0);
                $mAmt = (float) $mRow->amount;
                if (abs($sAmt - $mAmt) > 0.001) {
                    $auditReport['integrity_checks']['amount_mismatches']++;
                    $tableIssues[] = [
                        'type' => 'amount_mismatch',
                        'id' => $id,
                        'source' => $sAmt,
                        'mysql' => $mAmt,
                    ];
                }

                // Check JSON tags / preview_data
                if (is_array($mRow->tags) || is_null($mRow->tags)) {
                    $auditReport['integrity_checks']['json_payload_valid']++;
                }

                // Check foreign key: if user_id is set, does user exist?
                if ($mRow->user_id && !\App\Models\User::where('id', $mRow->user_id)->exists()) {
                    $auditReport['integrity_checks']['unresolved_foreign_keys']++;
                    $tableIssues[] = [
                        'type' => 'unresolved_fk',
                        'id' => $id,
                        'user_id' => $mRow->user_id,
                    ];
                }
            }

            $auditReport['tables'][$table] = [
                'source_count' => $sourceCount,
                'mysql_count' => $mysqlCount,
                'matched_records' => $tableMatched,
                'missing_records' => $tableMissing,
                'status' => ($sourceCount === $mysqlCount && $tableMissing === 0) ? 'PERFECT_MATCH' : 'DISCREPANCY',
                'issues' => $tableIssues,
            ];

            $summaryTable[] = [
                $table,
                $sourceCount,
                $mysqlCount,
                $tableMatched,
                $tableMissing,
                ($sourceCount === $mysqlCount && $tableMissing === 0)
                    ? '<info>PERFECT (100%)</info>'
                    : '<error>DISCREPANCY</error>',
            ];
        }

        $this->newLine();
        $this->table(['Table', 'Source', 'MySQL', 'Matched', 'Missing', 'Parity Status'], $summaryTable);

        $this->newLine();
        $this->info("Validation Summary:");
        $this->table(['Metric', 'Count'], [
            ['Total Source Records', $auditReport['total_source_records']],
            ['Total MySQL Records', $auditReport['total_mysql_records']],
            ['Primary Keys Matched', $auditReport['integrity_checks']['primary_keys_matched']],
            ['Missing Records', $auditReport['integrity_checks']['primary_keys_missing']],
            ['Amount Mismatches', $auditReport['integrity_checks']['amount_mismatches']],
            ['Unresolved Foreign Keys', $auditReport['integrity_checks']['unresolved_foreign_keys']],
        ]);

        $reportPath = $this->option('report') ?: storage_path('app/migration/validation_report.json');
        File::ensureDirectoryExists(dirname($reportPath));
        File::put($reportPath, json_encode($auditReport, JSON_PRETTY_PRINT));
        $this->info("Detailed JSON audit report saved to: [{$reportPath}]");

        return $auditReport['integrity_checks']['primary_keys_missing'] === 0 ? 0 : 1;
    }
}
