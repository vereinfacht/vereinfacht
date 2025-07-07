<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Member>
 */
class MemberFactory extends Factory
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
            'preferred_locale' => $this->faker->randomElement(config('app.supported_locales')),
            'birthday' => $this->faker->date(),
            'phone_number' => $this->faker->e164PhoneNumber(),
            'email' => $this->faker->safeEmail(),
            'consented_media_publication_at' => $this->faker->boolean() ? now()->subDays($this->faker->numberBetween(0, 20)) : null,
        ];
    }
}
