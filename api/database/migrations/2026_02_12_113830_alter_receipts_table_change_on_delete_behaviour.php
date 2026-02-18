<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            $table->dropForeign(['finance_contact_id']);

            $table
                ->foreign('finance_contact_id')
                ->references('id')
                ->on('finance_contacts')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            $table->dropForeign(['finance_contact_id']);

            $table
                ->foreign('finance_contact_id')
                ->references('id')
                ->on('finance_contacts')
                ->cascadeOnDelete();
        });
    }
};
