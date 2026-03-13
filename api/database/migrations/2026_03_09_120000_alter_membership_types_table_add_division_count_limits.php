<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('membership_types', function (Blueprint $table) {
            $table
                ->unsignedInteger('minimum_number_of_divisions')
                ->nullable()
                ->after('maximum_number_of_members');
            $table
                ->unsignedInteger('maximum_number_of_divisions')
                ->nullable()
                ->after('minimum_number_of_divisions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('membership_types', function (Blueprint $table) {
            $table->dropColumn([
                'minimum_number_of_divisions',
                'maximum_number_of_divisions',
            ]);
        });
    }
};
