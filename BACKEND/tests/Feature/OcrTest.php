<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class OcrTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@km100.ph',
            'password' => Hash::make('Admin123!'),
            'role' => 'admin',
            'branch' => 'All',
            'department' => 'Administration',
            'is_active' => true,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_ocr(): void
    {
        $response = $this->postJson('/api/v1/ocr/process', [
            'image' => 'data:image/jpeg;base64,sample',
        ]);

        $response->assertStatus(401);
    }

    public function test_ocr_extracts_structured_data_with_mocked_gemini(): void
    {
        Http::fake([
            'generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'establishment' => 'PETRON GAS STATION',
                                        'receipt_date' => '2026-03-24',
                                        'description' => 'Diesel Fuel',
                                        'or_number' => 'INV-8899',
                                        'amount' => 1250.00,
                                        'currency' => 'PHP',
                                        'line_items' => [
                                            ['description' => 'Diesel 20L', 'amount' => 1250.00],
                                        ],
                                    ]),
                                ],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $admin = User::where('email', 'admin@km100.ph')->first();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/v1/ocr/process', [
            'image' => 'data:image/jpeg;base64,' . base64_encode('fake-image-bytes'),
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'establishment' => 'PETRON GAS STATION',
                    'amount' => 1250.00,
                    'currency' => 'PHP',
                    'or_number' => 'INV-8899',
                ],
            ]);
    }
}
