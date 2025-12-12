<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\Statement\Parsers\CAMTParser;
use App\Services\Statement\Parsers\MT940Parser;
use App\Services\Statement\StatementParserResolver;

class StatementParserServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(StatementParserResolver::class, function ($app) {
            return new StatementParserResolver(
                $app,
                [
                    CAMTParser::class,
                    MT940Parser::class,
                ]
            );
        });
    }

    public function boot(): void {}
}
