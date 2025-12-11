'use client';

import Button from '@/app/components/Button/Button';
import Text from '@/app/components/Text/Text';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/app/components/ui/dialog';
import { capitalizeFirstLetter } from '@/utils/strings';
import { Table } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

interface Props {
    resources: any[];
    resourceName: string;
}

export default function ExportModule({ resources, resourceName }: Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            await exportToCSV();
        } catch (error) {
            console.error('Export failed:', error);
        } finally {
            setIsExporting(false);
            setIsOpen(false);
        }
    };

    const exportToCSV = async () => {
        const headers = [
            t('receipt:receipt_type.label'),
            t('receipt:reference_number.label'),
            t('receipt:document_date.label'),
            t('receipt:status.label'),
            t('receipt:amount.label'),
            t('tax_account:title.other'),
            t('tax_account:description.help'),
        ];

        const csvData = resources.map((resource) => [
            resource.receiptType || '',
            resource.referenceNumber || '',
            resource.documentDate || '',
            resource.status || '',
            resource.amount || 0,
            resource.taxAccount?.accountNumber || '',
            resource.taxAccount?.description || '',
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map((row) =>
                row
                    .map((cell) =>
                        typeof cell === 'string' && cell.includes(',')
                            ? `"${cell}"`
                            : cell,
                    )
                    .join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute(
            'download',
            `receipts_export_${new Date().toISOString().split('T')[0]}.csv`,
        );
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="mb-6 w-fit" type="button">
                    <Table className="mr-2 h-4 w-4" />
                    {t('general:table.export.title')}
                    {resources.length > 0 ? ` (${resources.length})` : ''}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t(`${resourceName}:title.other`)}{' '}
                            {t('general:export')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <Text>
                            {t('general:table.export.description', {
                                count: resources.length,
                            })}
                        </Text>
                    </DialogDescription>
                </DialogHeader>

                <div className="ml-auto flex pt-4">
                    <Button
                        preset="secondary"
                        type="button"
                        onClick={() => setIsOpen(false)}
                        disabled={isExporting}
                    >
                        {capitalizeFirstLetter(String(t('general:cancel')))}
                    </Button>
                    <Button
                        type="button"
                        onClick={handleExport}
                        isLoading={isExporting}
                        disabled={resources.length === 0}
                    >
                        {capitalizeFirstLetter(t('general:export'))}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
