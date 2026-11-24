<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Reusable Google Gemini AI Service for MacroSync.
 *
 * Handles:
 * - High-accuracy multimodal receipt extraction & image analysis
 * - Conversational text generation & chatbot assistants
 * - Multi-model fallback sequence (gemini-2.5-flash -> gemini-2.0-flash -> gemini-1.5-flash)
 * - Safe error handling and timeout resilience
 */
class GeminiService
{
    protected ?string $apiKey;
    protected string $primaryModel = 'gemini-3.8-flash';
    protected array $fallbackModels = ['gemini-3.5-flash'];
    protected string $apiBase = 'https://generativelanguage.googleapis.com/v1beta';

    public function __construct(?string $apiKey = null)
    {
        $this->apiKey = $apiKey ?: config('services.gemini.key', env('GEMINI_API_KEY'));
    }

    /**
     * Get candidate models in priority order.
     */
    public function getAvailableModels(): array
    {
        return array_values(array_unique(array_merge([$this->primaryModel], $this->fallbackModels)));
    }

    /**
     * Verify whether a valid Gemini API key is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Get the configured API key.
     */
    public function getApiKey(): ?string
    {
        return $this->apiKey;
    }

    /**
     * Ping test to check if the Gemini API key is valid and active across available models.
     */
    public function testConnection(): array
    {
        if (!$this->isConfigured()) {
            return [
                'ok' => false,
                'error' => 'Gemini API key is not configured on the server.',
            ];
        }

        $lastError = 'Unknown error';

        foreach ($this->getAvailableModels() as $model) {
            $endpoint = "{$this->apiBase}/models/{$model}:generateContent?key={$this->apiKey}";

            try {
                $response = Http::timeout(15)->post($endpoint, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => 'Ping test. Reply with OK'],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'thinkingConfig' => [
                            'thinkingBudget' => 0,
                        ],
                    ],
                ]);

                if ($response->successful()) {
                    return [
                        'ok' => true,
                        'status' => 'connected',
                        'model' => $model,
                        'message' => 'Gemini AI service is online and verified.',
                    ];
                }

                $errBody = $response->json();
                $lastError = $errBody['error']['message'] ?? "HTTP {$response->status()}";

                // Stop if bad API key
                if ($response->status() === 401 || $response->status() === 403) {
                    return [
                        'ok' => false,
                        'status' => 'error',
                        'error' => $lastError,
                    ];
                }

                // If rate limited by Google AI Studio
                if ($response->status() === 429) {
                    return [
                        'ok' => true,
                        'status' => 'rate_limited',
                        'model' => $model,
                        'message' => 'Gemini API key is active. Rate limit reached; quota will reset shortly.',
                    ];
                }
            } catch (Throwable $e) {
                $lastError = $e->getMessage();
            }
        }

        return [
            'ok' => false,
            'status' => 'error',
            'error' => $lastError,
        ];
    }

    /**
     * Multimodal Image Analysis: Extract structured receipt metadata.
     *
     * Preserves exact extraction logic, line item parsing, and non-receipt rejection rules.
     */
    public function extractReceiptData(string $imageBase64, ?string $receiptType = null): array
    {
        if (!$this->isConfigured()) {
            throw ValidationException::withMessages([
                'image' => ['Gemini API key is not configured on the server. Please set GEMINI_API_KEY in .env.'],
            ]);
        }

        // Clean and prepare base64 image data
        $cleanBase64 = $imageBase64;
        $mimeType = 'image/jpeg';

        if (preg_match('#^data:(image/\w+);base64,#i', $imageBase64, $m)) {
            $mimeType = $m[1];
            $cleanBase64 = substr($imageBase64, strpos($imageBase64, ',') + 1);
        }

        $cleanBase64 = str_replace(["\r", "\n", ' '], '', $cleanBase64);

        if (empty($cleanBase64)) {
            return [
                'success' => false,
                'is_receipt' => false,
                'message' => 'Empty or invalid image data provided.',
            ];
        }

        $typeContext = $receiptType ? "The document is being filed as: \"{$receiptType}\". " : '';

        $prompt = "You are an expert OCR accountant and financial document verifier reading physical and digital receipts.
CRITICAL VERIFICATION STEP:
First, determine whether this image is a genuine physical or digital receipt, sales invoice, official receipt (OR), cash voucher, billing invoice, or collection receipt.
- If the image is NOT a receipt (e.g. keyboard, monitor, face, animal, random object, blank paper, landscape, screenshot of non-financial app), set \"isReceipt\": false, explain in \"rejectionReason\", and leave other fields empty.
- If the image IS a valid receipt, invoice, or voucher, set \"isReceipt\": true and extract the actual data.

{$typeContext}Return ONLY valid JSON with the following structure:
{
  \"isReceipt\": true,
  \"rejectionReason\": \"\",
  \"establishment\": \"Store/vendor name (e.g. Petron, Red Goose, KM100)\",
  \"receipt_date\": \"YYYY-MM-DD format (or null if missing)\",
  \"description\": \"Concise summary of goods/services\",
  \"or_number\": \"Invoice, OR, or Reference Number (or null)\",
  \"amount\": 2750.00,
  \"currency\": \"PHP\",
  \"line_items\": [
    {
      \"qty\": \"1\",
      \"unit\": \"pc\",
      \"name\": \"Item description\",
      \"unit_price\": 2750.00,
      \"amount\": 2750.00
    }
  ]
}
Important:
- Read all items and entries into line_items accurately.
- Set amount to the final GRAND TOTAL.
- Do NOT hallucinate data. Return ONLY the raw JSON object without markdown fences.";

        $modelsToTry = array_merge([$this->primaryModel], $this->fallbackModels);

        foreach ($modelsToTry as $model) {
            try {
                $endpoint = "{$this->apiBase}/models/{$model}:generateContent?key={$this->apiKey}";

                $response = Http::timeout(35)->post($endpoint, [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                                [
                                    'inline_data' => [
                                        'mime_type' => $mimeType,
                                        'data' => $cleanBase64,
                                    ],
                                ],
                            ],
                        ],
                    ],
                    'generationConfig' => [
                        'temperature' => 0.1,
                        'response_mime_type' => 'application/json',
                    ],
                ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $rawText = $json['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
                    $cleanedText = preg_replace('/^```(?:json)?\s*|\s*```$/m', '', trim($rawText));
                    $parsed = json_decode($cleanedText, true);

                    if (is_array($parsed)) {
                        $isReceipt = $parsed['isReceipt'] ?? $parsed['is_receipt'] ?? true;
                        if (!$isReceipt) {
                            return [
                                'success' => true,
                                'is_receipt' => false,
                                'rejection_reason' => $parsed['rejectionReason'] ?? $parsed['rejection_reason'] ?? 'Image is not a receipt.',
                                'data' => null,
                            ];
                        }

                        $amount = (float) ($parsed['amount'] ?? 0);
                        $establishment = trim($parsed['establishment'] ?? '');
                        $orNumber = trim($parsed['or_number'] ?? $parsed['orNumber'] ?? '');

                        // Normalize line items
                        $lineItems = [];
                        $rawItems = $parsed['line_items'] ?? $parsed['lineItems'] ?? [];
                        if (is_array($rawItems)) {
                            foreach ($rawItems as $it) {
                                $lineItems[] = [
                                    'qty' => (string) ($it['qty'] ?? $it['quantity'] ?? '1'),
                                    'unit' => (string) ($it['unit'] ?? 'pc'),
                                    'name' => (string) ($it['name'] ?? $it['description'] ?? $it['item'] ?? ''),
                                    'unit_price' => (float) ($it['unit_price'] ?? $it['unitPrice'] ?? 0),
                                    'amount' => (float) ($it['amount'] ?? $it['total'] ?? 0),
                                ];
                            }
                        }

                        return [
                            'success' => true,
                            'is_receipt' => true,
                            'model_used' => $model,
                            'data' => [
                                'establishment' => $establishment,
                                'receipt_date' => $parsed['receipt_date'] ?? $parsed['receiptDate'] ?? null,
                                'description' => trim($parsed['description'] ?? ''),
                                'or_number' => $orNumber,
                                'amount' => $amount,
                                'currency' => $parsed['currency'] ?? 'PHP',
                                'line_items' => $lineItems,
                            ],
                        ];
                    }
                }

                // If auth error (401/403), stop fallback and report error
                if ($response->status() === 401 || $response->status() === 403) {
                    $errBody = $response->json();
                    return [
                        'success' => false,
                        'message' => 'Gemini API authentication failed: ' . ($errBody['error']['message'] ?? 'Invalid API key'),
                    ];
                }
            } catch (Throwable $e) {
                Log::warning("Gemini model {$model} extraction attempt failed: " . $e->getMessage());
            }
        }

        return [
            'success' => false,
            'message' => 'Gemini AI Vision was unable to parse this image. Please ensure the receipt is clear and well-lit.',
        ];
    }

    /**
     * Text Generation / Assistant / Chatbot Integration with fallback support.
     */
    public function generateText(string $prompt, ?string $systemInstruction = null, ?string $model = null): array
    {
        if (!$this->isConfigured()) {
            throw ValidationException::withMessages([
                'prompt' => ['Gemini API key is not configured on the server.'],
            ]);
        }

        $modelsToTry = $model ? [$model] : $this->getAvailableModels();

        $payload = [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt],
                    ],
                ],
            ],
            'generationConfig' => [
                'temperature' => 0.7,
                'thinkingConfig' => [
                    'thinkingBudget' => 0,
                ],
            ],
        ];

        if ($systemInstruction) {
            $payload['system_instruction'] = [
                'parts' => [
                    ['text' => $systemInstruction],
                ],
            ];
        }

        $lastError = 'Unknown error';

        foreach ($modelsToTry as $candidateModel) {
            $endpoint = "{$this->apiBase}/models/{$candidateModel}:generateContent?key={$this->apiKey}";

            try {
                $response = Http::timeout(15)->post($endpoint, $payload);

                if ($response->successful()) {
                    $json = $response->json();
                    $reply = $json['candidates'][0]['content']['parts'][0]['text'] ?? '';

                    return [
                        'success' => true,
                        'model' => $candidateModel,
                        'text' => trim($reply),
                    ];
                }

                $errBody = $response->json();
                $lastError = $errBody['error']['message'] ?? "HTTP {$response->status()}";

                if ($response->status() === 401 || $response->status() === 403) {
                    return [
                        'success' => false,
                        'message' => 'Gemini API authentication failed: ' . $lastError,
                    ];
                }
            } catch (Throwable $e) {
                $lastError = $e->getMessage();
                Log::warning("Gemini text generation on {$candidateModel} failed: " . $lastError);
            }
        }

        return [
            'success' => false,
            'message' => 'Failed to connect to Gemini AI: ' . $lastError,
        ];
    }
}
