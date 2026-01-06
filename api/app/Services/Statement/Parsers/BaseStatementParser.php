<?php

namespace App\Services\Statement\Parsers;

use App\Models\FinanceAccount;
use App\Services\Statement\Parsers\Contracts\StatementParserInterface;

abstract class BaseStatementParser implements StatementParserInterface
{
    protected array $actionStats = [
        'total_statements_created' => 0,
        'total_statements_skipped' => 0,
    ];

    public function __construct(
        protected FinanceAccount $financeAccount
    ) {}

    protected function incrementCreated(): void
    {
        $this->actionStats['total_statements_created']++;
    }

    protected function incrementSkipped(): void
    {
        $this->actionStats['total_statements_skipped']++;
    }

    protected function getStats(): array
    {
        return $this->actionStats;
    }
}
