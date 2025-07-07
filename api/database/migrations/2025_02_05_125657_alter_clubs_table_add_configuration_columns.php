<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->boolean('has_consented_media_publication_default_value')->default(0)->after('constitution_url');
            $table->boolean('has_consented_media_publication_is_required')->default(0)->after('constitution_url');
            $table->boolean('allow_voluntary_contribution')->nullable()->after('constitution_url');
            $table->string('membership_start_cycle_type')->nullable()->after('constitution_url');
        });

        Schema::table('memberships', function (Blueprint $table) {
            $table->unsignedInteger('voluntary_contribution')->after('owner_member_id')->nullable();
        });

        DB::statement('UPDATE clubs SET membership_start_cycle_type = "daily"');
    }

    public function down(): void
    {
        Schema::table('clubs', function (Blueprint $table) {
            $table->dropColumn('has_consented_media_publication_default_value');
            $table->dropColumn('has_consented_media_publication_is_required');
            $table->dropColumn('allow_voluntary_contribution');
            $table->dropColumn('membership_start_cycle_type');
        });

        Schema::table('memberships', function (Blueprint $table) {
            $table->dropColumn('voluntary_contribution');
        });
    }
};
