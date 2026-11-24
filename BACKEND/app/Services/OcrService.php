<?php

namespace App\Services;

/**
 * Optical Character Recognition Service (powered by GeminiService).
 *
 * Retained for architectural backward compatibility while delegating
 * multimodal OCR tasks to the reusable GeminiService.
 */
class OcrService
{
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Process image with Google Gemini Vision API to extract receipt metadata.
     */
    public function extractReceiptData(string $imageBase64, ?string $receiptType = null): array
    {
        return $this->geminiService->extractReceiptData($imageBase64, $receiptType);
    }
}
