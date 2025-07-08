<?php

namespace Database\Factories;

use App\Models\Club;
use App\Models\FinanceAccountType;
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
                'Sommerfest',
                'Vereinskasse',
                'Vereinsheim',
                'Getränke',
                'Sparbuch',
                'Volksbank Beiträge',
                'Postbank',
                'Sparkasse',
            ]),
            'iban' => $this->faker->iban('DE'),
            'bic' => $this->faker->swiftBicNumber(),
            'starts_at' => $this->faker->dateTime(),
            'initial_balance' => $this->faker->randomFloat(2, -1000, 1000),
            'club_id' => Club::factory(),
            'finance_account_type_id' => FinanceAccountType::factory(),

        ];
    }
}
