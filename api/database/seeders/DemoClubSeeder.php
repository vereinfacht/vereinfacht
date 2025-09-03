<?php

namespace Database\Seeders;

use App\Models\Club;
use Faker\Generator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class DemoClubSeeder extends Seeder
{
    protected $faker;

    protected $clubTitle = 'TSV Muster';

    protected $slug = 'tsv-muster';

    public function __construct(Generator $faker)
    {
        $this->faker = $faker;
    }

    public function run(): void
    {
        if (Club::where('title', $this->clubTitle)->exists()) {
            $this->command->warn(
                'Demo club already exists. Aborted seeding ' . self::class . '.'
            );

            return;
        }

        $this->seedDemoClub();
    }

    protected function seedDemoClub()
    {
        $club = Club::factory()->create($this->getClubData());

        foreach ($this->getMembershipTypesData() as $membershipType) {
            $club->membershipTypes()->create($membershipType);
        }

        foreach ($this->getDivisionsData() as $division) {
            $club->divisions()->create(Arr::only($division, ['title']));
        }

        $this->attachDivisionsToMembershipTypes($club);

        $fakeClubsSeeder = new FakeClubsSeeder($this->faker);
        $fakeClubsSeeder->attachPaymentPeriods($club);
        $fakeClubsSeeder->createClubMemberships($club);
        $fakeClubsSeeder->attachMembersToDivision($club);
        $fakeClubsSeeder->assignClubAdminRole($club, "Jane Doe");
        $fakeClubsSeeder->assignSuperAdminRole($club);
    }

    protected function attachDivisionsToMembershipTypes(Club $club): void
    {
        $divisions = $club->divisions()->get();
        $divisionsData = $this->getDivisionsData();
        $membershipTypes = $club->membershipTypes();

        $divisions->each(
            fn($division, $divisionIndex) => $membershipTypes->each(function ($membershipType, $membershipTypeIndex) use ($division, $divisionsData, $divisionIndex) {
                $divisionData = $divisionsData[$divisionIndex];

                if (!$divisionData['membership_types'][$membershipTypeIndex]) {
                    return;
                }

                $membershipType
                    ->divisions()
                    ->attach(
                        $division->id,
                        ['monthly_fee' => $divisionData['monthly_fee'][$membershipTypeIndex]]
                    );
            })
        );
    }

    protected function getClubData(): array
    {
        return [
            'title' => $this->clubTitle,
            'slug' => $this->slug,
            'extended_title' => 'Turn- und Sportverein Muster e. V.',
            'apply_title->de' => null,
            'apply_title->en' => null,
            'address' => 'Musterstraße 70',
            'zip_code' => '12345',
            'city' => 'Musterstadt',
            'country' => 'Germany',
            'preferred_locale' => 'de',
            'website_url' => 'https://vereinfacht.digital',
            'primary_color' => '#00b0ff',
            'logo_url' => 'https://vereinfacht.digital/assets/logo-tsv-muster.png',
            'membership_start_cycle_type' => 'daily',
            'allow_voluntary_contribution' => true,
            'has_consented_media_publication_is_required' => false,
            'has_consented_media_publication_default_value' => false,
        ];
    }

    protected function getDivisionsData(): array
    {
        return [
            [
                'title' => [
                    'de' => 'Fußball',
                    'en' => 'Football',
                ],
                'membership_types' => [true, true, true],
                'monthly_fee' => [2, null, null],
            ],
            [
                'title' => [
                    'de' => 'Handball',
                    'en' => 'Handball',
                ],
                'membership_types' => [true, true, true],
                'monthly_fee' => [2, null, null],
            ],
            [
                'title' => [
                    'de' => 'Basketball',
                    'en' => 'Basketball',
                ],
                'membership_types' => [true, true, true],
                'monthly_fee' => [2, null, null],
            ],
            [
                'title' => [
                    'de' => 'Volleyball',
                    'en' => 'Volleyball',
                ],
                'membership_types' => [true, true, true],
                'monthly_fee' => [2, null, null],
            ],
            [
                'title' => [
                    'de' => 'Tennis',
                    'en' => 'Tennis',
                ],
                'membership_types' => [false, true, true],
                'monthly_fee' => [5, 5, 5],
            ],
            [
                'title' => [
                    'de' => 'Golf',
                    'en' => 'Golf',
                ],
                'membership_types' => [false, true, true],
                'monthly_fee' => [7.5, 7.5, 7.5],
            ],
            [
                'title' => [
                    'de' => 'Yoga-Kurse',
                    'en' => 'Yoga Classes',
                ],
                'membership_types' => [true, true, true],
                'monthly_fee' => [5, 5, 5],
            ],
            [
                'title' => [
                    'de' => 'Fitness-Studio',
                    'en' => 'Gym',
                ],
                'membership_types' => [false, true, true],
                'monthly_fee' => [null, null, null],
            ],
        ];
    }

    protected function getMembershipTypesData(): array
    {
        return [
            [
                'title' => [
                    'de' => 'Probe-Mitgliedschaft',
                    'en' => 'Trial Membership',
                ],
                'description' => [
                    'de' => 'Für alle, die den Verein erstmal kennenlernen wollen.',
                    'en' => 'For all who want to get to know the club first.',
                ],
                'minimum_number_of_months' => 1,
                'minimum_number_of_members' => 1,
                'maximum_number_of_members' => 1,
                'monthly_fee' => 3,
            ],
            [
                'title' => [
                    'de' => 'Erwachsene',
                    'en' => 'Adults',
                ],
                'description' => [
                    'de' => 'Für alle über 18.',
                    'en' => 'For all over 18.',
                ],
                'minimum_number_of_months' => 3,
                'minimum_number_of_members' => 1,
                'maximum_number_of_members' => 1,
                'admission_fee' => 3,
                'monthly_fee' => 10,
            ],
            [
                'title' => [
                    'de' => 'Familien',
                    'en' => 'Families',
                ],
                'description' => [
                    'de' => 'Ideal für Familien.',
                    'en' => 'Ideal for families.',
                ],
                'minimum_number_of_months' => 3,
                'minimum_number_of_members' => 2,
                'maximum_number_of_members' => 5,
                'admission_fee' => 5,
                'monthly_fee' => 20,
            ],
        ];
    }
}
