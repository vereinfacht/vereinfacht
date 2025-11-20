<?php

namespace App\Actions\Statement;

use Jejik\MT940\Reader;
use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Support\Arr;
use App\Parsers\VRBankParser;
use App\Models\FinanceAccount;
use Jejik\MT940\StatementInterface;
use Jejik\MT940\TransactionInterface;
use App\Classes\StatementIdentifierGenerator;
use App\Parsers\HaspaParser;

class FileImport
{
    protected $file;
    protected $actionStats;
    protected $financeAccount;

    public function __construct($file)
    {
        $this->file = $file;
        $this->actionStats = [
            'total_statements_created' => 0,
            'total_statements_skipped' => 0,
        ];
    }

    public function execute(FinanceAccount $financeAccount): array
    {
        $this->financeAccount = $financeAccount;
        $reader = new Reader();

        $parsers = $reader->getDefaultParsers() + [
            'Hamburger Sparkasse AG' => HaspaParser::class,
            'Volksbank Schleswig-Holstein Nord eG' => VRBankParser::class,
        ];

        $reader->addParsers($parsers);

        try {
            $statements = $reader->getStatements(
                file_get_contents($this->file->getRealPath())
            );
        } catch (\Throwable $th) {
            throw new \Exception('Failed to parse the statement file: ' . $th->getMessage());
        }

        foreach ($statements as $parsedStatement) {
            try {
                $this->createStatementWithTransactions($parsedStatement);
            } catch (\Throwable $th) {
                throw new \Exception('Failed to create statement – possibly invalid data format:' . $th->getMessage());
            }
        }

        return $this->actionStats;
    }



    protected function createStatementWithTransactions(StatementInterface $parsedStatement): void
    {
        $sharedStatementData = [
            'date' => $parsedStatement->getClosingBalance()->getDate() ?? now(),
            'finance_account_id' => $this->financeAccount->id,
            'club_id' => $this->financeAccount->club_id,
        ];
        // @todo: convert non-EUR currencies to EUR and save converted amount, original amount and the applied exchange rate
        $currency = Arr::get($parsedStatement->getClosingBalance(), 'currency', 'EUR');

        foreach ($parsedStatement->getTransactions() as $transaction) {
            if ($this->isCollectiveTransfer($transaction)) {
                // handling collective transfer transactions is not yet supported
                $this->actionStats['total_statements_skipped']++;
                continue;
            }

            $statementIdentifier = StatementIdentifierGenerator::generate(
                $sharedStatementData['date'],
                $transaction->getAmount(),
                $transaction->getDescription()
            );

            $statement = Statement::firstOrCreate([
                'identifier' => $statementIdentifier
            ], $sharedStatementData);

            if ($statement->wasRecentlyCreated === false) {
                $this->actionStats['total_statements_skipped']++;
                continue;
            }

            $this->createTransaction($statement, $transaction, $currency);
        }
    }

    protected function createTransaction(Statement $statement, TransactionInterface $transaction, string $currency): void
    {
        $transaction = Transaction::create([
            'title' => $transaction->getTxText() ?? '-',
            'description' => $transaction->getSvwz(),
            'gvc' => (int) $transaction->getGVC(),
            'bank_iban' => $transaction->getIBAN(),
            'bank_account_holder' => $transaction->getAccountHolder(),
            'statement_id' => $statement->id,
            'currency' => $currency,
            'amount' => $transaction->getAmount(),
            'valued_at' => $transaction->getValueDate(),
            'booked_at' => $transaction->getBookDate(),
        ]);

        $this->actionStats['total_statements_created']++;
    }

    protected function isCollectiveTransfer(TransactionInterface $transaction): bool
    {
        return Arr::exists(
            [
                "188",
                "189",
                "191",
                "192",
                "194",
                "195",
                "196",
                "197"
            ],
            $transaction->getGVC() ?? ''
        );
    }
}
