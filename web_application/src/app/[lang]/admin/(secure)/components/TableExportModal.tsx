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
import { useToast } from '@/hooks/toast/use-toast';
import { capitalizeFirstLetter } from '@/utils/strings';
import { Table } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import SubmitButton from './Form/SubmitButton';

interface Props {
    ids: string[];
    resourceName: string;
}

export default function TableExportModal({ ids, resourceName }: Props) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData();

        ids?.forEach((id) => {
            formData.append('ids[]', id);
        });

        formData.append('resourceName', resourceName);

        const response = await fetch('/api/export/table', {
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
        const contentDisposition = response.headers.get('content-disposition');
        const fileName =
            contentDisposition?.split('filename=')[1]?.replace(/"/g, '') ||
            `${resourceName}_export.csv`;
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
                <Button className="mb-6 w-fit" type="button">
                    <Table className="mr-2 h-4 w-4" />
                    {t('general:table.export.title')}
                    {ids && ids.length > 0 ? ` (${ids.length})` : ''}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('general:table.export.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <Text>
                            {t('general:table.export.description', {
                                count: ids?.length,
                            })}
                        </Text>
                    </DialogDescription>
                </DialogHeader>

                <form
                    className="container flex flex-col gap-8"
                    onSubmit={handleSubmit}
                >
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
