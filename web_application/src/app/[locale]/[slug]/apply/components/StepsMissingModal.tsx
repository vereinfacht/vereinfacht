'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/app/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/app/components/ui/dialog';

interface Props {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function StepsMissingModal({ isOpen, setIsOpen }: Props) {
    const t = useTranslations();

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        {t('application.steps_missing_modal.title')}
                    </DialogTitle>
                    <DialogDescription>
                        {t('application.steps_missing_modal.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 flex justify-end">
                    <Button onClick={() => setIsOpen(false)}>
                        {t('application.steps_missing_modal.ok')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
