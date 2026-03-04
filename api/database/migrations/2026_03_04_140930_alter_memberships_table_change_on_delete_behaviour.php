<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('memberships', function (Blueprint $table) {
            $table->dropForeign(['membership_type_id']);

            $table
                ->foreign('membership_type_id')
                ->references('id')
                ->on('membership_types')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('memberships', function (Blueprint $table) {
            $table->dropForeign(['membership_type_id']);

            $table
                ->foreign('membership_type_id')
                ->references('id')
                ->on('membership_types')
                ->cascadeOnDelete();
        });
    }
};
