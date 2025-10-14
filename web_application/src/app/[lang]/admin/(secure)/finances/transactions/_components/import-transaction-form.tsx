'use client';

import Button from '@/app/components/Button/Button';
import { MediaInput } from '@/app/components/Input/MediaInput';
import Text from '@/app/components/Text/Text';
import ProgressBar from '@/app/components/ui/progress-bar';
import { CircleCheck } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

interface ImportTransactionFormProps {
    onDone?: () => void;
}

export default function ImportTransactionForm({
    onDone,
}: ImportTransactionFormProps) {
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

    const handleDone = () => {
        setFile(null);
        setExpectedCount(null);
        setImportedCount(0);
        setProgress(0);
        setMessage('');
        setIsImporting(false);

        if (onDone) onDone();
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

            {expectedCount !== null && !isImporting && (
                <Text>Expected transactions in the file: {expectedCount}</Text>
            )}

            {isImporting && (
                <Text>
                    Importing transaction {importedCount} / {expectedCount}
                </Text>
            )}

            {!isImporting && progress === 100 && (
                <Text>Import done: {importedCount}</Text>
            )}

            {progress > 0 && (
                <div className="mt-2 flex h-4 items-center gap-4">
                    <ProgressBar
                        value={progress}
                        ariaLabel={`Import progress: ${Math.round(progress)}%`}
                    />
                    {progress == 100 ? (
                        <CircleCheck className="text-green-400" />
                    ) : (
                        <Text className="text-sm text-gray-700">
                            {Math.round(progress)}%
                        </Text>
                    )}
                </div>
            )}

            {message && <Text>{message}</Text>}

            <div className="flex justify-end">
                {progress < 100 && (
                    <Button
                        type="button"
                        disabled={!file || expectedCount === 0 || isImporting}
                        onClick={handleImport}
                        isLoading={isImporting}
                    >
                        import
                    </Button>
                )}
                {!isImporting && progress === 100 && (
                    <Button type="button" onClick={handleDone}>
                        done
                    </Button>
                )}
            </div>
        </div>
    );
}
