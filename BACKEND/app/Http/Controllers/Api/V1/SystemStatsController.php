<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ReceiptService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemStatsController extends Controller
{
    protected ReceiptService $receiptService;

    public function __construct(ReceiptService $receiptService)
    {
        $this->receiptService = $receiptService;
    }

    /**
     * Calculate aggregate statistics across all receipt tables.
     */
    public function summary(Request $request): JsonResponse
    {
        $stats = $this->receiptService->getSystemStats($request->user());

        return response()->json([
            'success' => true,
            'data' => $stats,
        ], 200);
    }
}
