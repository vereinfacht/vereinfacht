<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Receipt>
 */
class ReceiptFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $receiptType = $this->faker->randomElement(['income', 'expense']);
        $amount = $this->faker->randomFloat(2, 10, 999);

        return [
            'reference_number' => $this->faker->unique()->numerify('REF-#####'),
            'receipt_type' => $receiptType,
            'document_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'amount' => $receiptType === 'expense' ? -$amount : $amount,
        ];
    }
}
