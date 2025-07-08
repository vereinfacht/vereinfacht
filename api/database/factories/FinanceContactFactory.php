<?php

namespace Database\Factories;

use App\Models\Club;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FinanceAccount>
 */
class FinanceContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'gender' => $this->faker->randomElement([null, 'male', 'female', 'other']),
            'address' => $this->faker->streetAddress(),
            'zip_code' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'phone_number' => $this->faker->e164PhoneNumber(),
            'email' => $this->faker->safeEmail(),
            'club_id' => Club::factory(),
            'type' => 'person',
        ];
    }

    public function company(): Factory
    {
        return $this->state(function (array $attributes) {
            $hasPersonName = $this->faker->boolean();

            return [
                'first_name' => $hasPersonName ? $attributes['first_name'] : null,
                'last_name' => $hasPersonName ? $attributes['last_name'] : null,
                'company_name' => $this->faker->company(),
                'type' => 'company',
            ];
        });
    }
}
