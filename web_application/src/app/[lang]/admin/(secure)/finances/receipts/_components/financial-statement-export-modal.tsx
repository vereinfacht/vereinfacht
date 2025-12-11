'use client';

import Button from '@/app/components/Button/Button';
import Checkbox from '@/app/components/Input/Checkbox';
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
import { Download } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import SubmitButton from '../../../components/Form/SubmitButton';
import { useToast } from '@/hooks/toast/use-toast';

interface Props {
    receiptIds?: string[];
}

export default function FinancialStatementExportModal({ receiptIds }: Props) {
    const { t } = useTranslation();
    const { toast } = useToast();
    const [includeMedia, setIncludeMedia] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData();

        receiptIds?.forEach((id) => {
            formData.append('receipts[]', id);
        });

        if (includeMedia) {
            formData.append('includeMedia', 'on');
        }

        const response = await fetch('/api/export/financial-statement', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            toast({
                variant: 'error',
                description: t('notification:resource.action.error'),
            });
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');

        a.href = url;
        const headers = Object.fromEntries(response.headers);
        const fileName = headers['disposition']
            ?.split('filename=')[1]
            .replace(/"/g, '') as string;
        a.download = fileName;

        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="mb-6 w-fit"
                    type="button"
                    disabled={!receiptIds || receiptIds.length === 0}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {t('financial_statement:export')}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('financial_statement:export_form.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <Text>
                            {t('financial_statement:export_form.description', {
                                count: receiptIds?.length,
                            })}
                        </Text>
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="container flex flex-col gap-8"
                    onSubmit={handleSubmit}
                >
                    <Checkbox
                        name="includeMedia"
                        id="includeMedia"
                        label={t(
                            'financial_statement:export_form.include_media_help',
                        )}
                        defaultValue={includeMedia}
                        handleChange={(event) =>
                            setIncludeMedia(event.target.checked)
                        }
                    />
                    <div className="flex gap-4 self-end">
                        <Button
                            preset="secondary"
                            type="button"
                            onClick={() => setIsOpen(false)}
                        >
                            {capitalizeFirstLetter(String(t('general:cancel')))}
                        </Button>
                        <SubmitButton title={t('general:export')} />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
