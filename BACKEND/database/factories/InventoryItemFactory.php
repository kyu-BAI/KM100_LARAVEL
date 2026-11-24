<?php

namespace Database\Factories;

use App\Models\InventoryItem;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InventoryItem>
 */
class InventoryItemFactory extends Factory
{
    protected $model = InventoryItem::class;

    public function definition(): array
    {
        $entity = fake()->randomElement(['PETC', 'Red Goose', 'Knoah Mari']);
        $categories = [
            'PETC Sales' => 'petc-sales',
            'PETC Insurance' => 'petc-insurance',
            'Expenses' => 'expenses',
            'Consumables' => 'consumables',
            'Vouchers' => 'vouchers',
        ];
        $category = fake()->randomElement(array_keys($categories));
        $categoryId = $categories[$category];

        return [
            'id' => (string) Str::uuid(),
            'user_id' => User::factory(),
            'file_name' => 'REC_' . strtoupper(Str::random(8)) . '.jpg',
            'title' => fake()->words(3, true),
            'establishment' => fake()->company(),
            'receipt_date' => fake()->date('Y-m-d'),
            'description' => fake()->sentence(),
            'category' => $category,
            'category_id' => $categoryId,
            'sub_category' => "{$entity} {$category}",
            'sub_category_id' => Str::slug("{$entity} {$category}"),
            'entity' => $entity,
            'year' => (string) fake()->numberBetween(2024, 2026),
            'month' => fake()->randomElement(['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']),
            'amount' => fake()->randomFloat(2, 50, 5000),
            'currency' => 'PHP',
            'quantity' => 1.00,
            'unit' => 'receipt',
            'status' => 'Active',
            'file_format' => 'JPG',
            'file_size' => fake()->numberBetween(50, 250) . ' KB',
            'file_path' => null,
            'notes' => fake()->optional()->sentence(),
            'tags' => ['inventory', 'verified'],
            'preview_data' => [
                'establishment' => fake()->company(),
                'confidence' => 0.95,
            ],
            'scanned_at' => now(),
        ];
    }
}
