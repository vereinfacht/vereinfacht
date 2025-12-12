<?php

namespace App\Services\Statement\Parsers;

use Jejik\MT940\Reader;
use App\Models\Statement;
use App\Models\Transaction;
use Illuminate\Support\Arr;
use Jejik\MT940\StatementInterface;
use Jejik\MT940\TransactionInterface;
use App\Classes\StatementIdentifierGenerator;
use App\Services\Statement\Parsers\Extensions\VRBankParser;

class MT940Parser extends BaseStatementParser
{

    public function canParse(string $content): bool
    {
        return str_contains($content, ':20:') || str_contains($content, ':25:');
    }

    public function parse(string $filePath): array
    {
        try {
            $content = trim(file_get_contents($filePath));
            $reader = new Reader();
            $parsers = $reader->getDefaultParsers() + [
                'Volksbank' => VRBankParser::class,
            ];
            $reader->addParsers($parsers);

            $statements = $reader->getStatements($content);
        } catch (\Throwable $th) {
            throw new \Exception('Failed to parse the MT940 statement file: ' . $th->getMessage());
        }

        foreach ($statements as $parsedStatement) {
            try {
                $this->createStatementWithTransactions($parsedStatement);
            } catch (\Throwable $th) {
                throw new \Exception('Failed to create statement – possibly invalid data format:' . $th->getMessage());
            }
        }

        return $this->getStats();
    }

    protected function createStatementWithTransactions(StatementInterface $parsedStatement): void
    {
        $sharedStatementData = [
            'date' => $parsedStatement->getClosingBalance()->getDate(),
            'finance_account_id' => $this->financeAccount->id,
            'club_id' => $this->financeAccount->club_id,
        ];
        // @todo: convert non-EUR currencies to EUR and save converted amount, original amount and the applied exchange rate
        $currency = Arr::get($parsedStatement->getClosingBalance(), 'currency', 'EUR');

        $collectiveTransfers = [];

        foreach ($parsedStatement->getTransactions() as $transaction) {
            if ($transaction->getGVC() === '191') {
                $collectiveTransferId = $transaction->getKref();
                $collectiveTransfers[$collectiveTransferId][] = $transaction;
                continue;
            }

            $statementIdentifier = StatementIdentifierGenerator::generate(
                $sharedStatementData['date'],
                $transaction->getAmount(),
                $transaction->getDescription()
            );

            $statement = Statement::firstOrCreate([
                'identifier' => $statementIdentifier,
                'statement_type' => $this->isUnsupportedCollectiveTransfer($transaction) ? 'collective' : 'individual',
            ], $sharedStatementData);

            if ($statement->wasRecentlyCreated === false) {
                $this->incrementSkipped();
                continue;
            }

            $this->incrementCreated();

            $this->createTransaction($statement, $transaction, $currency);
        }

        foreach ($collectiveTransfers as $key => $transactions) {
            $statementIdentifier = StatementIdentifierGenerator::generate(
                $sharedStatementData['date'],
                array_sum(array_map(fn($transaction) => $transaction->getAmount(), $transactions)),
                $key
            );

            $statement = Statement::firstOrCreate([
                'identifier' => $statementIdentifier,
                'statement_type' => 'collective',
            ], $sharedStatementData);

            if ($statement->wasRecentlyCreated === false) {
                $this->incrementSkipped();
                continue;
            }

            $this->incrementCreated();

            foreach ($transactions as $transaction) {
                $this->createTransaction($statement, $transaction, $currency);
            }
        }
    }

    protected function createTransaction(Statement $statement, TransactionInterface $transaction, string $currency): void
    {
        Transaction::create([
            'title' => $this->toUtf8($transaction->getTxText()) ?? '',
            'description' => $this->toUtf8($transaction->getSvwz() ?? $this->toUtf8($transaction->getDescription())),
            'gvc' => (int) $transaction->getGVC(),
            'bank_iban' => $this->toUtf8($transaction->getIBAN()),
            'bank_account_holder' => $this->toUtf8($transaction->getAccountHolder()),
            'statement_id' => $statement->id,
            'currency' => $currency,
            'amount' => $transaction->getAmount(),
            'valued_at' => $transaction->getValueDate(),
            'booked_at' => $transaction->getBookDate(),
        ]);
    }

    protected function isUnsupportedCollectiveTransfer(TransactionInterface $transaction): bool
    {
        $collectiveTransferGVCs = [
            "188",
            "189",
            "192",
            "194",
            "195",
            "196",
            "197"
        ];

        return in_array($transaction->getGVC() ?? '', $collectiveTransferGVCs, true);
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
