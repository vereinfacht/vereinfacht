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
        Schema::create('payment_periods', function (Blueprint $table) {
            $table->id();
            $table->text('rrule');
            $table->timestamps();
        });

        $now = now();

        DB::table('payment_periods')->insert([[
            'rrule' => 'FREQ=MONTHLY;INTERVAL=1',
            'created_at' => $now,
            'updated_at' => $now,
        ], [
            'rrule' => 'FREQ=MONTHLY;INTERVAL=3',
            'created_at' => $now,
            'updated_at' => $now,
        ], [
            'rrule' => 'FREQ=YEARLY;INTERVAL=1',
            'created_at' => $now,
            'updated_at' => $now,
        ]]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_periods');
    }
};
