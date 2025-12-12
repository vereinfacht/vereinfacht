<?php

namespace App\Services\Statement\Parsers\Contracts;

interface StatementParserInterface
{
    public function canParse(string $content): bool;

    public function parse(string $filePath): array;
}
