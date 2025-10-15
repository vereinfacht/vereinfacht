<?php

namespace Database\Factories;

use App\Models\Club;
use App\Models\FinanceAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $valuedAt = $this->faker->dateTimeBetween('-1 year', 'now');
        $bookedAt = $valuedAt->modify('+' . $this->faker->numberBetween(0, 2) . ' days');

        return [
            'name' => $this->faker->name(),
            'description' => $this->faker->text(50),
            'amount' => $this->faker->randomFloat(2, -1000, 1000),
            'valued_at' => $valuedAt,
            'booked_at' => $bookedAt,
        ];
    }
}
