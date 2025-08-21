<?php

namespace Database\Factories;

use App\Models\Club;
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
        return [
            'reference_number' => $this->faker->unique()->numerify('REF-#####'),
            'type' => $this->faker->randomElement(['income', 'expense']),
            'document_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'amount' => $this->faker->randomFloat(2, 99, 9999),

            'transaction_id' => $this->faker->boolean(70)
                ? Transaction::factory()
                : null,
            'club_id' => Club::factory(),
        ];
    }
}
