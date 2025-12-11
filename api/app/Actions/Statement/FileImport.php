<?php

namespace App\Actions\Statement;

use App\Models\FinanceAccount;
use App\Services\Statement\StatementParserResolver;

class FileImport
{
    public function __construct(
        private StatementParserResolver $parserResolver
    ) {}

    public function execute($file, FinanceAccount $financeAccount): array
    {
        $content = trim(file_get_contents($file->getRealPath()));
        $parser = $this->parserResolver->resolve($content, $financeAccount);

        return $parser->parse($file->getRealPath());
    }
}
