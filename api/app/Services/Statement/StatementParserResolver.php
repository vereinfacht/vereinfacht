<?php

namespace App\Services\Statement;

use App\Models\FinanceAccount;
use Illuminate\Contracts\Container\Container;
use App\Services\Statement\Parsers\Contracts\StatementParserInterface;

class StatementParserResolver
{
    /** @var array<class-string<StatementParserInterface>> */
    private array $parserClasses;

    public function __construct(
        private Container $container,
        array $parserClasses = []
    ) {
        $this->parserClasses = $parserClasses ?: [
            \App\Services\Statement\Parsers\CAMTParser::class,
            \App\Services\Statement\Parsers\MT940Parser::class,
        ];
    }

    public function resolve(string $content, FinanceAccount $financeAccount): StatementParserInterface
    {
        foreach ($this->parserClasses as $parserClass) {
            /** @var StatementParserInterface $parser */
            $parser = $this->container->make($parserClass, ['financeAccount' => $financeAccount]);

            if ($parser->canParse($content)) {
                return $parser;
            }
        }

        throw new \InvalidArgumentException('No suitable parser found for the uploaded file format.');
    }
}
