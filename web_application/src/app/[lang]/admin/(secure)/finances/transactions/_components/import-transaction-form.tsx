'use client';

import Button from '@/app/components/Button/Button';
import { MediaInput } from '@/app/components/Input/MediaInput';
import Text from '@/app/components/Text/Text';
import ProgressBar from '@/app/components/ui/progress-bar';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

export default function ImportTransactionForm() {
    const { t } = useTranslation();

    const [file, setFile] = useState<File | null>(null);
    const [expectedCount, setExpectedCount] = useState<number | null>(null);
    const [importedCount, setImportedCount] = useState<number>(0);
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [isImporting, setIsImporting] = useState(false);

    const countTransactions = async (file: File) => {
        const text = await file.text();
        return text.split(/\r?\n/).filter((line) => line.startsWith(':61:'))
            .length;
    };

    useEffect(() => {
        if (!file) {
            setExpectedCount(null);
            setMessage('');
            return;
        }

        countTransactions(file)
            .then((count) => {
                setExpectedCount(count);
                setMessage(count > 0 ? '' : 'No transactions found in file.');
            })
            .catch(() => {
                setMessage('Invalid file.');
                setExpectedCount(null);
            });
    }, [file]);

    const handleImport = async () => {
        if (!file || expectedCount === null || expectedCount === 0) return;

        setIsImporting(true);
        setImportedCount(0);
        setProgress(0);
        setMessage('');

        for (let i = 1; i <= expectedCount; i++) {
            await new Promise((r) => setTimeout(r, 1200));
            setImportedCount(i);
            setProgress((i / expectedCount) * 100);
        }

        setMessage(`Successfully imported ${expectedCount} transaction(s).`);
        setIsImporting(false);
        setFile(null);
        setExpectedCount(null);
    };

    return (
        <div className="space-y-4">
            <MediaInput
                id="transaction-file"
                label={t('transaction:file.label')}
                help={t('transaction:file.help')}
                accept=".txt,.mta"
                disabled={isImporting}
                onFilesChange={(files) => setFile(files[0] ?? null)}
            />

            {expectedCount !== null && (
                <Text>Expected transactions: {expectedCount}</Text>
            )}

            {isImporting && (
                <Text>
                    Importing transaction {importedCount} / {expectedCount}
                </Text>
            )}

            {progress > 0 && (
                <div className="mt-2 h-4">
                    <ProgressBar
                        value={progress}
                        ariaLabel={`Import progress: ${Math.round(progress)}%`}
                    />
                    <Text className="text-sm text-gray-700">
                        {Math.round(progress)}%
                    </Text>
                </div>
            )}

            {message && (
                <Text
                    aria-live="polite"
                    className={
                        message.includes('Successfully')
                            ? 'text-green-600'
                            : 'text-red-600'
                    }
                >
                    {message}
                </Text>
            )}

            <div className="flex justify-end">
                <Button
                    type="button"
                    disabled={!file || expectedCount === 0 || isImporting}
                    onClick={handleImport}
                    isLoading={isImporting}
                >
                    import
                </Button>
            </div>
        </div>
    );
}
