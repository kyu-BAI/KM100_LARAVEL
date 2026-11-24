<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class GeminiTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@km100.ph',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_gemini(): void
    {
        $response = $this->getJson('/api/v1/gemini/health');
        $response->assertStatus(401);

        $postRes = $this->postJson('/api/v1/gemini/generate', [
            'prompt' => 'Hello',
        ]);
        $postRes->assertStatus(401);
    }

    public function test_gemini_health_endpoint_reports_connected(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [['text' => 'OK']],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/v1/gemini/health');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'ok' => true,
                    'status' => 'connected',
                ],
            ]);
    }

    public function test_gemini_generates_text_content(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'The total expenses for PETC branch in March 2026 are 4,554.00 PHP.'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/gemini/generate', [
            'prompt' => 'Summarize PETC March 2026 expenses',
            'system_instruction' => 'You are an accounting assistant for KM100.',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'text' => 'The total expenses for PETC branch in March 2026 are 4,554.00 PHP.',
            ]);
    }

    public function test_gemini_multimodal_receipt_processing(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'isReceipt' => true,
                                        'rejectionReason' => '',
                                        'establishment' => 'SHELL GASOLINE STATION',
                                        'receipt_date' => '2026-11-20',
                                        'description' => 'Unleaded Fuel Refill',
                                        'or_number' => 'OR-99124',
                                        'amount' => 1800.50,
                                        'currency' => 'PHP',
                                        'line_items' => [
                                            [
                                                'qty' => '30',
                                                'unit' => 'L',
                                                'name' => 'V-Power Gasoline',
                                                'unit_price' => 60.01,
                                                'amount' => 1800.50,
                                            ],
                                        ],
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/gemini/process-receipt', [
            'image' => 'data:image/jpeg;base64,' . base64_encode('sample-shell-receipt'),
            'receipt_type' => 'PETC Expense',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'is_receipt' => true,
                'data' => [
                    'establishment' => 'SHELL GASOLINE STATION',
                    'amount' => 1800.50,
                    'currency' => 'PHP',
                    'or_number' => 'OR-99124',
                ],
            ]);
    }

    public function test_gemini_handles_api_errors_gracefully(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'error' => [
                    'code' => 503,
                    'message' => 'The model is overloaded. Please try again later.',
                ],
            ], 503),
        ]);

        $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/v1/gemini/generate', [
            'prompt' => 'Test overloaded',
        ]);

        // Should return a clean JSON error response, NOT an unhandled 500 crash
        $response->assertStatus(502)
            ->assertJson([
                'success' => false,
            ]);
    }
}
