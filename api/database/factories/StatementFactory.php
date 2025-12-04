<?php

namespace Database\Factories;

use App\Classes\StatementIdentifierGenerator;
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
        $statementTypes = ['collective', 'individual'];

        return [
            'identifier' => StatementIdentifierGenerator::generate(
                $date,
                $this->faker->randomFloat(2, -10000, 10000),
                $this->faker->uuid()
            ),
            'date' => $date,
            'statement_type' => $this->faker->randomElement($statementTypes),
            'club_id' => Club::factory(),
            'finance_account_id' => FinanceAccount::factory(),
        ];
    }
}
