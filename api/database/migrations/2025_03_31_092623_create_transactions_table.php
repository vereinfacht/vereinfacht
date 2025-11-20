<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('description')->nullable();
            $table->smallInteger('gvc')->nullable();
            $table->string('bank_iban')->nullable();
            $table->string('bank_account_holder')->nullable();
            $table->string('currency');
            $table->integer('amount');

            $table->foreignId('statement_id')
                ->constrained('statements')
                ->cascadeOnDelete();

            $table->timestamp('valued_at')->nullable();
            $table->timestamp('booked_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
