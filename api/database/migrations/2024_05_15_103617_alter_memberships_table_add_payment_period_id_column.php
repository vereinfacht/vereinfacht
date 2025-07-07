<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('memberships', function (Blueprint $table) {
            $table->foreignId('payment_period_id')->nullable()->after('bank_account_holder');
        });

        $now = now();
        $monthlyPeriodId = DB::table('payment_periods')->where('rrule', 'FREQ=MONTHLY;INTERVAL=1')->first()->id;

        DB::table('clubs')->get()->each(function ($club) use ($monthlyPeriodId, $now) {
            DB::table('club_payment_period')
                ->insert([
                    'club_id' => $club->id,
                    'payment_period_id' => $monthlyPeriodId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
        });

        DB::table('memberships')->get()->each(function ($membership) use ($monthlyPeriodId) {
            DB::table('memberships')
                ->where('id', $membership->id)
                ->update(['payment_period_id' => $monthlyPeriodId]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('memberships', function (Blueprint $table) {
            $table->dropForeign(['payment_period_id']);
            $table->dropColumn('payment_period_id');
        });
    }
};
