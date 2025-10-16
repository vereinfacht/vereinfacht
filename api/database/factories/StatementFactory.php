<?php

namespace Database\Factories;

use App\Models\Club;
use App\Models\FinanceAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Statement>
 */
class StatementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $date = $this->faker->dateTimeBetween('-1 year', 'now');

        return [
            'identifier' => $this->faker->uuid(),
            'date' => $date,
            'club_id' => Club::factory(),
            'finance_account_id' => FinanceAccount::factory(),
        ];
    }
}
