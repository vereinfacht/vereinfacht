<?php

namespace App\Services\Statement\Parsers;

use DateTime;
use Exception;
use Throwable;
use DateTimeImmutable;
use Genkgo\Camt\Config;
use Genkgo\Camt\Reader;
use App\Models\Statement;
use Genkgo\Camt\DTO\Entry;
use App\Models\Transaction;
use Genkgo\Camt\DTO\IbanAccount;
use App\Classes\StatementIdentifierGenerator;

class CAMTParser extends BaseStatementParser
{

    public function canParse(string $content): bool
    {
        return str_starts_with(trim($content), '<?xml') || str_contains($content, '<Document');
    }

    public function parse(string $filePath): array
    {
        try {
            $reader = new Reader(Config::getDefault());
            $message = $reader->readFile($filePath);
            $statements = $message->getRecords();
        } catch (Throwable $th) {
            throw new Exception('Failed to parse the XML statement file: ' . $th->getMessage());
        }

        foreach ($statements as $statement) {
            foreach ($statement->getEntries() as $entry) {
                try {
                    $this->createStatementWithTransactions($entry);
                } catch (Throwable $th) {
                    throw new Exception('Failed to create statement – possibly invalid data format:' . $th->getMessage());
                }
            }
        }

        return $this->getStats();
    }

    private function createStatementWithTransactions(Entry $entry): void
    {
        $date = $entry->getBookingDate() ?? $entry->getValueDate() ?? now();

        if ($date instanceof DateTimeImmutable) {
            $date = DateTime::createFromImmutable($date);
        }

        $sharedStatementData = [
            'date' => $date,
            'finance_account_id' => $this->financeAccount->id,
            'club_id' => $this->financeAccount->club_id,
        ];

        $currency = $entry->getAmount()->getCurrency()->getCode() ?: 'EUR';
        $transactionDetails = $entry->getTransactionDetails();

        // If there are multiple transaction details, treat it as a collective statement
        if (count($transactionDetails) > 1) {
            $statementIdentifier = StatementIdentifierGenerator::generate(
                $date,
                $this->convertAmount($entry->getAmount()->getAmount()),
                $entry->getBatchPaymentId() ?? $entry->getAdditionalInfo() ?? 'collective'
            );

            $statement = Statement::firstOrCreate([
                'identifier' => $statementIdentifier,
                'statement_type' => 'collective',
            ], $sharedStatementData);

            if ($statement->wasRecentlyCreated === false) {
                $this->incrementSkipped();
                return;
            }

            $this->incrementCreated();

            foreach ($transactionDetails as $transactionDetail) {
                $this->createTransaction($statement, $transactionDetail, $currency);
            }
        } else {
            // Individual statement
            $transactionDetail = $transactionDetails[0] ?? null;

            $statementIdentifier = StatementIdentifierGenerator::generate(
                $date,
                $this->convertAmount($entry->getAmount()->getAmount()),
                $this->getTransactionDescription($transactionDetail)
            );

            $statement = Statement::firstOrCreate([
                'identifier' => $statementIdentifier,
                'statement_type' => 'individual',
            ], $sharedStatementData);

            if ($statement->wasRecentlyCreated === false) {
                $this->incrementSkipped();
                return;
            }

            $this->incrementCreated();

            if ($transactionDetail) {
                $this->createTransaction($statement, $transactionDetail, $currency);
            }
        }
    }

    private function createTransaction(Statement $statement, $transactionDetail, string $currency): void
    {
        $relatedParty = $transactionDetail->getRelatedParties()[0] ?? null;
        $remittanceInfo = $transactionDetail->getRemittanceInformation();

        Transaction::create([
            'title' => $this->getTransactionDescription($transactionDetail),
            'description' => $remittanceInfo ? $remittanceInfo->getMessage() : null,
            'gvc' => $this->extractGVC($transactionDetail),
            'bank_iban' => $this->getIban($relatedParty),
            'bank_account_holder' => $this->getAccountHolder($relatedParty),
            'statement_id' => $statement->id,
            'currency' => $currency,
            'amount' => $this->convertAmount($transactionDetail->getAmount()->getAmount()),
            'valued_at' => $transactionDetail->getRelatedDates() ? null : $statement->date,
            'booked_at' => $statement->date,
        ]);
    }

    private function convertAmount(string $amount): float
    {
        return (float) $amount / 100;
    }

    private function getTransactionDescription($transactionDetail): string
    {
        if (!$transactionDetail) {
            return '';
        }

        $remittanceInfo = $transactionDetail->getRemittanceInformation();

        if ($remittanceInfo && $remittanceInfo->getMessage()) {
            return substr($remittanceInfo->getMessage(), 0, 100);
        }

        $reference = $transactionDetail->getReference();

        if ($reference && $reference->getEndToEndId() && $reference->getEndToEndId() !== 'NONREF') {
            return $reference->getEndToEndId();
        }

        return 'CAMT Transaction';
    }

    private function extractGVC($transactionDetail): ?int
    {
        if (!$transactionDetail) {
            return null;
        }

        $bankTransactionCode = $transactionDetail->getBankTransactionCode();
        if ($bankTransactionCode && $bankTransactionCode->getProprietary()) {
            $code = $bankTransactionCode->getProprietary()->getCode();

            if (preg_match('/\+(\d+)\+/', $code, $matches)) {
                return (int) $matches[1];
            }
        }

        return null;
    }

    private function getIban($relatedParty): ?string
    {
        if (!$relatedParty || !$relatedParty->getAccount()) {
            return null;
        }

        $account = $relatedParty->getAccount();
        if ($account instanceof IbanAccount) {
            return (string) $account->getIban();
        }

        return null;
    }

    private function getAccountHolder($relatedParty): ?string
    {
        if (!$relatedParty) {
            return null;
        }

        $partyType = $relatedParty->getRelatedPartyType();
        if ($partyType && $partyType->getName()) {
            return $partyType->getName();
        }

        return null;
    }
}
