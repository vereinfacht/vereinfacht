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
        $financeAccountType = FinanceAccountType::factory()->create();

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
            'iban' => $financeAccountType->id !== 2 ? $this->faker->iban('DE') : null,
            'bic' => $financeAccountType->id !== 2 ? $this->faker->swiftBicNumber() : null,
            'starts_at' => $this->faker->dateTime(),
            'initial_balance' => $this->faker->randomFloat(2, -1000, 1000),
            'club_id' => Club::factory(),
            'finance_account_type_id' => $financeAccountType->id,
        ];
    }
}
