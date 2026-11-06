'use client';

import { useTranslations } from 'next-intl';
import FormStateHandler from '@/app/[locale]/admin/(secure)/components/Form/FormStateHandler';
import type { FormAction, FormActionState } from '@/types/form-actions';
import SubmitButton from '@/app/[locale]/admin/(secure)/components/Form/SubmitButton';
import { Button } from '@/app/components/ui/button';
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
import IconBin from '/public/svg/bin.svg';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useActionState } from 'react';

interface Props {
    deleteAction?: FormAction;
    id?: string | number;
    translationKey?: string;
    disabled?: boolean;
}

export default function DeleteForm({
    deleteAction,
    id,
    translationKey = 'resource',
    disabled = false,
}: Props) {
    const t = useTranslations();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const [formState, formAction] = useActionState<FormActionState, FormData>(
        deleteAction ??
            (async (_state: FormActionState, _formData: FormData) => ({
                success: false,
            })),
        { success: false },
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="tertiary"
                    danger={true}
                    size={'iconSm'}
                    rightIcon={<IconBin />}
                    data-cy={`delete-${id}-button`}
                    title={t('general.delete')}
                    disabled={disabled}
                    aria-disabled={disabled}
                />
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('general.delete_confirmation.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <Text>
                            {t('general.delete_confirmation.description')}
                        </Text>
                    </DialogDescription>
                </DialogHeader>
                {!disabled && (
                    <form
                        action={formAction}
                        className="container flex flex-col gap-8"
                    >
                        {id && <input type="hidden" name="id" value={id} />}
                        <FormStateHandler
                            state={formState}
                            translationKey={translationKey}
                            type="delete"
                            onSuccess={() => {
                                setIsOpen(false);
                                router.refresh();
                            }}
                        />
                        <div className="flex gap-4 self-end">
                            <Button
                                variant="secondary"
                                onClick={() => setIsOpen(false)}
                            >
                                {capitalizeFirstLetter(t('general.cancel'))}
                            </Button>
                            <SubmitButton
                                danger={true}
                                title={t('general.delete')}
                            />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
