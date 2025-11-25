<?php

namespace App\Actions\Statement;

use Jejik\MT940\Reader;
use App\Models\Statement;
use App\Models\Transaction;
use App\Parsers\VRBankParser;
use App\Models\FinanceAccount;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Jejik\MT940\StatementInterface;
use Jejik\MT940\TransactionInterface;
use App\Classes\StatementIdentifierGenerator;

class FileImport
{
    private object $stats;
    private FinanceAccount $financeAccount;

    public function __construct(private readonly UploadedFile $file)
    {
        $this->stats = (object) [
            'total_statements_created' => 0,
            'total_statements_skipped' => 0,
        ];
    }

    public function execute(FinanceAccount $financeAccount): array
    {
        $this->financeAccount = $financeAccount;

        $statements = $this->parseFile();

        foreach ($statements as $parsedStatement) {
            $this->importParsedStatement($parsedStatement);
        }

        return (array) $this->stats;
    }

    protected function parseFile(): array
    {
        $reader = new Reader();
        $reader->addParsers(
            $reader->getDefaultParsers() + [
                'Volksbank' => VRBankParser::class,
            ]
        );

        try {
            $content = file_get_contents($this->file->getRealPath());

            return $reader->getStatements(trim($content));
        } catch (\Throwable $e) {
            throw new \RuntimeException(
                "Failed to parse MT940 file '{$this->file->getClientOriginalName()}': {$e->getMessage()}",
                previous: $e
            );
        }
    }

    protected function importParsedStatement(StatementInterface $parsedStatement): void
    {
        DB::transaction(function () use ($parsedStatement) {

            $closingBalance = $parsedStatement->getClosingBalance();
            $statementDate = $closingBalance?->getDate() ?? now();
            $currency = $closingBalance?->getCurrency() ?? 'EUR';

            $transactions = $parsedStatement->getTransactions();

            if (empty($transactions)) {
                return;
            }

            $firstTransaction = $transactions[0];
            $identifier = StatementIdentifierGenerator::generate(
                $statementDate,
                $firstTransaction->getAmount(),
                $firstTransaction->getDescription()
            );

            $statement = Statement::firstOrCreate(
                ['identifier' => $identifier],
                [
                    'date' => $statementDate,
                    'finance_account_id' => $this->financeAccount->id,
                    'club_id' => $this->financeAccount->club_id,
                ]
            );

            if (!$statement->wasRecentlyCreated) {
                $this->stats->total_statements_skipped++;
                return;
            }

            foreach ($transactions as $parsedTransaction) {
                $this->createTransaction($statement, $parsedTransaction, $currency);
            }

            $this->stats->total_statements_created++;
        });
    }

    protected function createTransaction(Statement $statement, TransactionInterface $parsedTransaction, string $currency): void
    {
        Transaction::create([
            'title' => $this->toUtf8($parsedTransaction->getTxText() ?: '-'),
            'description' => $this->toUtf8($parsedTransaction->getSvwz()),
            'gvc' => (int) $parsedTransaction->getGVC(),
            'bank_iban' => $this->toUtf8($parsedTransaction->getIBAN()),
            'bank_account_holder' => $this->toUtf8($parsedTransaction->getAccountHolder()),
            'statement_id' => $statement->id,
            'currency' => $currency,
            'amount' => $parsedTransaction->getAmount(),
            'valued_at' => $parsedTransaction->getValueDate(),
            'booked_at' => $parsedTransaction->getBookDate(),
        ]);
    }

    protected function toUtf8(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (mb_check_encoding($value, 'UTF-8')) {
            return $value;
        }

        return mb_convert_encoding($value, 'UTF-8', 'ISO-8859-1, Windows-1252');
    }
}
