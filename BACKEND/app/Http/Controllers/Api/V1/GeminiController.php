<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GeminiController extends Controller
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Check Gemini API connectivity and service status.
     */
    public function health(Request $request): JsonResponse
    {
        $status = $this->geminiService->testConnection();

        return response()->json([
            'success' => $status['ok'] ?? false,
            'data' => $status,
        ], ($status['ok'] ?? false) ? 200 : 503);
    }

    /**
     * Process multimodal receipt image through Gemini Vision AI.
     */
    public function processReceipt(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|string',
            'receipt_type' => 'nullable|string',
        ]);

        $result = $this->geminiService->extractReceiptData(
            $validated['image'],
            $validated['receipt_type'] ?? null
        );

        return response()->json($result, ($result['success'] ?? false) ? 200 : 422);
    }

    /**
     * Generate content / conversational assistant reply.
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'prompt' => 'required|string',
            'system_instruction' => 'nullable|string',
            'model' => 'nullable|string',
        ]);

        $result = $this->geminiService->generateText(
            $validated['prompt'],
            $validated['system_instruction'] ?? null,
            $validated['model'] ?? null
        );

        return response()->json($result, ($result['success'] ?? false) ? 200 : 502);
    }
}
