<?php

namespace Database\Seeders;

use App\Models\Club;
use App\Models\Member;
use App\Models\Membership;
use App\Models\PaymentPeriod;
use App\Models\User;
use Faker\Generator;
use Illuminate\Database\Seeder;

class FakeClubsSeeder extends Seeder
{
    protected $faker;

    public function __construct(Generator $faker)
    {
        $this->faker = $faker;
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Club::factory(5)
            ->hasDivisions(5)
            ->hasMembershipTypes(3)
            ->create()
            ->each(fn($club) => $this->attachDivisionsToMembershipTypes($club))
            ->each(fn($club) => $this->attachPaymentPeriods($club))
            ->each(fn($club) => $this->createClubMemberships($club))
            ->each(fn($club) => $this->attachMembersToDivision($club))
            ->each(fn($club) => $this->assignClubAdminRole($club))
            ->each(fn($club) => $this->assignSuperAdminRole($club));
    }

    protected function attachDivisionsToMembershipTypes($club)
    {
        $divisions = $club->divisions()->get();

        $club->membershipTypes()->each(function ($membershipType) use ($divisions) {
            $divisions->random($this->faker->numberBetween(0, $divisions->count()))->each(
                fn($division) => $membershipType
                    ->divisions()
                    ->attach(
                        $division->id,
                        ['monthly_fee' => $this->faker->randomElement([null, 0, 2, 2.25, 5.5, 7, 10])]
                    )
            );
        });
    }

    protected function createClubMemberships($club)
    {
        Membership::factory(10)
            ->make([
                'club_id' => $club->id,
            ])
            ->each(function ($membership) use ($club) {
                $membership->membershipType()->associate($club->membershipTypes()->inRandomOrder()->first());
                $membership->paymentPeriod()->associate($club->paymentPeriods()->inRandomOrder()->first());
                $membership->voluntary_contribution = $club->allow_voluntary_contribution ? $this->faker->randomElement([null, $this->faker->numberBetween(0, 10)]) : null;
                $membership->save();
            });

        $club->memberships()->each(fn($membership) => $this->createMembershipMembers($membership, $club));
    }

    protected function createMembershipMembers($membership, $club)
    {
        $maxMembers = $membership->membershipType()->first()->maximum_number_of_members;

        $members = Member::factory($this->faker->numberBetween(1, $maxMembers))
            ->create([
                'club_id' => $club->id,
                'membership_id' => $membership->id,
            ]);
        $membership->owner_member_id = $members->first()->id;
        $membership->save();
    }

    protected function attachPaymentPeriods($club)
    {
        $paymentPeriods = PaymentPeriod::inRandomOrder()->get();

        for ($i = 0; $i < $this->faker->numberBetween(0, $paymentPeriods->count()); $i++) {
            $club->paymentPeriods()->attach($paymentPeriods[$i]);
        }
    }

    protected function attachMembersToDivision($club)
    {
        $divisions = $club->divisions()->get(['id']);
        $club->members()
            ->get()
            ->each(fn($member) => $member->divisions()->attach($divisions->random()->id));
    }

    protected function assignClubAdminRole($club)
    {
        setPermissionsTeamId($club);

        User::factory([
            'email' => "club-admin-{$club->getKey()}@example.org",
        ])->create()->assignRole('club admin');

        $additionalClubAdmins = $this->faker->numberBetween(5, 10);

        for ($i = 1; $i < $additionalClubAdmins; $i++) {
            User::factory()->create()->assignRole('club admin');
        }
    }

    protected function assignSuperAdminRole($club)
    {
        setPermissionsTeamId($club);
        User::where('email', 'hello@vereinfacht.digital')->first()->assignRole('super admin');
    }
}
