<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('receipts')
            ->where('amount', '<', 0)
            ->update(['amount' => DB::raw('ABS(amount)')]);

        Schema::table('receipts', function (Blueprint $table) {
            $table->unsignedInteger('amount')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            $table->integer('amount')->change();
        });
    }
};
