<?php

namespace Database\Factories;

use App\Enums\MembershipStatusEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Membership>
 */
class MembershipFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // not all iban formats are currently validated correctly,
            // but the most common formats should be
            // 'bank_iban' => $this->faker->iban(),
            'bank_iban' => $this->faker->randomElement([
                $this->faker->iban('DE'),
                $this->faker->iban('DK'),
                $this->faker->iban('NL'),
            ]),
            'bank_account_holder' => $this->faker->name(),
            'started_at' => $this->faker->dateTime(),
            'notes' => $this->faker->randomElement([null, $this->faker->text(1500)]),
            'status' => $this->faker->randomElement(array_merge(
                [null],
                array_column(MembershipStatusEnum::cases(), 'value')
            )),
            'voluntary_contribution' => $this->faker->randomElement([null, $this->faker->randomFloat(2, 0, 10)]),
        ];
    }
}
