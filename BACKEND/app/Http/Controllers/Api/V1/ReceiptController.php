<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\BulkDeleteReceiptRequest;
use App\Http\Requests\V1\StoreReceiptRequest;
use App\Http\Requests\V1\UpdateReceiptRequest;
use App\Http\Resources\V1\ReceiptResource;
use App\Services\ReceiptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReceiptController extends Controller
{
    protected ReceiptService $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }

    /**
     * List receipts based on table, branch, and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'table',
            'entity',
            'year',
            'month',
            'category',
            'status',
            'search',
            'limit',
        ]);

        $receipts = $this->receiptService->listReceipts($request->user(), $filters);

        return response()->json([
            'success' => true,
            'data' => ReceiptResource::collection($receipts),
            'meta' => [
                'total' => $receipts->count(),
                'table' => $filters['table'] ?? 'inventory_items',
            ],
        ], 200);
    }

    /**
     * Store a new receipt record.
     */
    public function store(StoreReceiptRequest $request): JsonResponse
    {
        $receipt = $this->receiptService->createReceipt($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Receipt created successfully.',
            'data' => new ReceiptResource($receipt),
        ], 201);
    }

    /**
     * Retrieve a single receipt record.
     */
    public function show(Request $request, string $id): JsonResponse
    {
        $tableName = $request->query('table') ?: $request->input('table', 'inventory_items');
        $receipt = $this->receiptService->findReceipt($request->user(), $tableName, $id);

        return response()->json([
            'success' => true,
            'data' => new ReceiptResource($receipt),
        ], 200);
    }

    /**
     * Update an existing receipt record.
     */
    public function update(UpdateReceiptRequest $request, string $id): JsonResponse
    {
        $validated = $request->validated();
        $tableName = $validated['table'];
        unset($validated['table']);

        $receipt = $this->receiptService->updateReceipt($request->user(), $tableName, $id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Receipt updated successfully.',
            'data' => new ReceiptResource($receipt),
        ], 200);
    }

    /**
     * Delete a single receipt record.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        $tableName = $request->query('table') ?: $request->input('table', 'inventory_items');
        $this->receiptService->deleteReceipt($request->user(), $tableName, $id);

        return response()->json([
            'success' => true,
            'message' => 'Record deleted successfully.',
        ], 200);
    }

    /**
     * Bulk delete records.
     */
    public function bulkDestroy(BulkDeleteReceiptRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $deletedCount = $this->receiptService->bulkDeleteReceipts(
            $request->user(),
            $validated['table'],
            $validated['ids']
        );

        return response()->json([
            'success' => true,
            'message' => "Successfully deleted {$deletedCount} records.",
            'data' => [
                'deleted_count' => $deletedCount,
            ],
        ], 200);
    }
}
