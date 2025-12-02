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
import { TReceiptDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import { Download, ExternalLink, FileSpreadsheet } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

interface Props {
    receipts: TReceiptDeserialized[];
}

export default function ExportModule({ receipts }: Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const mediaCount = receipts.reduce((count, receipt) => {
        return count + (receipt.media ? receipt.media.length : 0);
    }, 0);

    console.log('Total media files for export:', mediaCount);

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

        const csvData = receipts.map((receipt) => [
            receipt.receiptType || '',
            receipt.referenceNumber || '',
            receipt.documentDate || '',
            receipt.status || '',
            receipt.amount || 0,
            receipt.taxAccount?.accountNumber || '',
            receipt.taxAccount?.description || '',
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

    const handleMediaDownload = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        e.preventDefault();
        console.log('Download receipt media files');
    };

    const handleEvaluationDownload = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    ) => {
        e.preventDefault();
        console.log('Download receipt evaluation');
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="mb-6 w-fit" type="button">
                    <Download className="mr-2 h-4 w-4" />
                    {capitalizeFirstLetter(String(t('general:export')))}
                    {receipts.length > 0 ? ` (${receipts.length})` : ''}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('receipt:export_modal.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="flex flex-col gap-4">
                            <Text>
                                {t('receipt:export_modal.description', {
                                    count: receipts.length,
                                })}
                            </Text>
                            <div>
                                <Text className="inline">
                                    {t(
                                        'receipt:export_modal.evaluation_description',
                                    )}
                                </Text>
                                <a
                                    className="ml-2 inline-block"
                                    type="link"
                                    onClick={handleEvaluationDownload}
                                    href="#"
                                >
                                    <ExternalLink className="h-6 w-6 text-blue-500 hover:scale-110" />
                                </a>
                            </div>
                            <div className="flex items-center rounded-md bg-slate-100 p-6">
                                {t('receipt:export_modal.media', {
                                    count: mediaCount,
                                })}
                                <a
                                    type="link"
                                    onClick={handleMediaDownload}
                                    href="#"
                                    className="ml-2"
                                >
                                    <Download className="h-6 w-6 text-blue-500 hover:scale-110" />
                                </a>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-between pt-4">
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
                        disabled={receipts.length === 0}
                    >
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        {capitalizeFirstLetter(t('general:export'))} CSV
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
