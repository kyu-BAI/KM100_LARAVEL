<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\OcrService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OcrController extends Controller
{
    protected OcrService $ocrService;

    public function __construct(OcrService $ocrService)
    {
        $this->ocrService = $ocrService;
    }

    /**
     * Process an image using Google Gemini Vision AI OCR.
     */
    public function process(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'image' => 'required|string',
            'receipt_type' => 'nullable|string',
        ]);

        $result = $this->ocrService->extractReceiptData(
            $validated['image'],
            $validated['receipt_type'] ?? null
        );

        return response()->json($result, $result['success'] ? 200 : 422);
    }
}
