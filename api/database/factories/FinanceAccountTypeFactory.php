<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FinanceAccountType>
 */
class FinanceAccountTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => [
                'en' => 'fake account type '.$this->faker->word(),
                'de' => 'fake konto typ '.$this->faker->word(),
            ],
        ];
    }
}
