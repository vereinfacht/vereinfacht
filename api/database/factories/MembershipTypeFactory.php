<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MembershipType>
 */
class MembershipTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $minimumNumberOfMembers = $this->faker->randomElement([1, 2, 3]);
        $maximumNumberOfMembers = $this->faker->randomElement([
            $minimumNumberOfMembers * 1,
            $minimumNumberOfMembers * 2,
            $minimumNumberOfMembers * 3,
        ]);

        return [
            'title->de' => 'de '.$this->faker->word(),
            'title->en' => 'en '.$this->faker->word(),
            'description->de' => 'de '.$this->faker->paragraph(),
            'description->en' => 'en '.$this->faker->paragraph(),
            'admission_fee' => $this->faker->randomElement([null, 0, 10, 20]),
            'monthly_fee' => $this->faker->randomElement([5, 10, 20]),
            'minimum_number_of_months' => $this->faker->randomElement([1, 3, 6, 12]),
            'minimum_number_of_members' => $minimumNumberOfMembers,
            'maximum_number_of_members' => $maximumNumberOfMembers,
        ];
    }
}
