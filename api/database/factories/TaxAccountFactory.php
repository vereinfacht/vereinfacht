<?php

namespace Database\Factories;

use App\Models\TaxAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TaxAccount>
 */
class TaxAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $attributes = [
            'account_number' => $this->faker->unique()->numerify('####'),
            'description' => $this->faker->sentence(6),
        ];

        return $attributes;
    }
}
