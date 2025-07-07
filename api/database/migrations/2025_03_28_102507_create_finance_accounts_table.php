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
        Schema::create('finance_accounts', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            $table->string('iban')->nullable();
            $table->string('bic')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->integer('initial_balance')->nullable();

            $table->foreignId('club_id')
                ->constrained('clubs')
                ->cascadeOnDelete();
            $table->foreignId('finance_account_type_id')
                ->constrained('finance_account_types')
                ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finance_accounts');
    }
};
