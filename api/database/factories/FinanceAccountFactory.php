<?php

namespace Database\Factories;

use App\Models\Club;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FinanceAccount>
 */
class FinanceAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->randomElement([
                'Sparbuch',
                'Volksbank Beiträge',
                'Postbank',
                'Sparkasse',
            ]),
            'iban' => $this->faker->iban('DE'),
            'starts_at' => $this->faker->dateTime(),
            'club_id' => Club::factory(),
            'account_type' => 'bank_account',
        ];
    }

    public function cashBox(): Factory
    {
        return $this->state(function (array $attributes) {
            return [
                'title' => $this->faker->randomElement([
                    'Sommerfest',
                    'Vereinskasse',
                    'Vereinsheim',
                    'Getränke',
                ]),
                'iban' => null,
                'starts_at' => $this->faker->dateTime(),
                'initial_balance' => $this->faker->randomFloat(2, -1000, 1000),
                'club_id' => Club::factory(),
                'account_type' => 'cash_box',
            ];
        });
    }
}
