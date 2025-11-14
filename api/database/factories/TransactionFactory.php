<?php

namespace Database\Factories;

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
        $currencies = [
            'EUR' => 1.0,
            'DKK' => 7.45,
        ];
        $currency = 'EUR';

        if ($this->faker->boolean(20)) {
            $currency = 'DKK';
        }

        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->text(50),
            'gvc' => 105,
            'bank_iban' => $this->faker->iban(),
            'bank_account_holder' => $this->faker->name(),
            'currency' => $currency,
            'amount' => $this->faker->randomFloat(2, -1000, 1000) * $currencies[$currency],
            'valued_at' => $valuedAt,
            'booked_at' => $bookedAt,
        ];
    }
}
