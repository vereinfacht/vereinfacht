'use client';

import { exportFinancialStatementFormAction } from '@/actions/financialStatement/export';
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
import { TReceiptDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import { Download } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import FormField from '../../../components/Form/FormField';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';

interface Props {
    receipts: TReceiptDeserialized[];
}

export interface ExportFormActionState extends FormActionState {
    downloadContent?: any;
    downloadType?: 'csv' | 'zip';
    message?: string;
}

export default function FinancialStatementExportModule({ receipts }: Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [includeMedia, setIncludeMedia] = useState(false);

    const [formState, formAction] = useFormState<
        ExportFormActionState,
        FormData
    >(exportFinancialStatementFormAction, {
        success: false,
    });

    useEffect(() => {
        if (formState.success && formState.downloadContent) {
            let blob: Blob;
            let fileName: string;
            const dateStr = new Date().toISOString().slice(0, 10);

            if (formState.downloadType === 'zip') {
                blob = new Blob([formState.downloadContent], {
                    type: 'application/zip',
                });
                fileName = `financial-statement-${dateStr}.zip`;
            } else {
                blob = new Blob([formState.downloadContent], {
                    type: 'application/vnd.ms-excel',
                });
                fileName = `financial-statement-${dateStr}.csv`;
            }

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setIsOpen(false);
        }
    }, [formState.success, formState.downloadContent, formState.downloadType]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-fit" type="button">
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
                            {t('financial_statement:export_form.description')}
                        </Text>
                    </DialogDescription>
                </DialogHeader>
                <form
                    action={formAction}
                    className="container flex flex-col gap-8"
                >
                    <FormStateHandler
                        state={formState}
                        translationKey="financial_statement:export_form"
                        onSuccess={() => {
                            setIsOpen(false);
                        }}
                    />
                    <input
                        type="hidden"
                        name="receipts"
                        value={JSON.stringify(
                            receipts.map((receipt) => receipt.id),
                        )}
                    />
                    <FormField errors={formState.errors?.['includeMedia']}>
                        <Checkbox
                            name="includeMedia"
                            id="include-media"
                            label={t(
                                'financial_statement:export_form.include_media_help',
                            )}
                            value={includeMedia ? 'true' : 'false'}
                            onChange={(e) =>
                                setIncludeMedia(
                                    (e.target as HTMLInputElement).checked,
                                )
                            }
                        />
                    </FormField>
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
