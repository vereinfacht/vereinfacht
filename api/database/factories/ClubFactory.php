<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Club>
 */
class ClubFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $primaryColor = $this->faker->hexColor();
        $urlFormattedPrimaryColor = strtoupper(ltrim($primaryColor, '#'));

        $attributes = [
            'title' => $this->faker->unique()->company(),
            'extended_title' => $this->faker->company() . ' ' . $this->faker->companySuffix(),
            'address' => $this->faker->streetAddress(),
            'zip_code' => $this->faker->postcode(),
            'city' => $this->faker->city(),
            'country' => $this->faker->country(),
            'preferred_locale' => $this->faker->randomElement(config('app.supported_locales')),
            'email' => $this->faker->safeEmail(),
            'website_url' => $this->faker->url(),
            'primary_color' => $primaryColor,
            'logo_url' => "https://placehold.co/600x400/{$urlFormattedPrimaryColor}/FFFFFF/?text=Logo",
            'privacy_statement_url' => $this->faker->url(),
            'contribution_statement_url' => $this->faker->url(),
            'constitution_url' => $this->faker->url(),
            'membership_start_cycle_type' => $this->faker->randomElement(['daily', 'monthly']),
            'allow_voluntary_contribution' => $this->faker->boolean(),
            'has_consented_media_publication_is_required' => $this->faker->boolean(),
            'has_consented_media_publication_default_value' => $this->faker->boolean(),
        ];

        if ($this->faker->boolean()) {
            $attributes = array_merge($attributes, [
                'apply_title->de' => 'Mitglied werden. Weitere Details in unserer <a href="https://example.org" target="_blank">Beitragsstruktur</a>.',
                'apply_title->en' => 'Become a member. More details in our <a href="https://example.org" target="_blank">fee structure</a>.',
            ]);
        }

        return $attributes;
    }
}
