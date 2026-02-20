'use client';

import FormStateHandler, {
    FormActionState,
} from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import SubmitButton from '@/app/[lang]/admin/(secure)/components/Form/SubmitButton';
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
import { Trash } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {
    deleteAction?: (formData: FormData) => Promise<FormActionState>;
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
    const { t } = useTranslation();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const [formState, formAction] = useFormState<FormActionState, FormData>(
        deleteAction
            ? (_prevState: FormActionState, formData: FormData) =>
                  deleteAction(formData)
            : async () => ({ success: false }),
        {
            success: false,
        },
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button
                    data-cy={`delete-${id}-button`}
                    title={t('general:delete')}
                    className={[
                        'transition-color duration-300',
                        disabled
                            ? 'cursor-not-allowed opacity-30'
                            : 'cursor-pointer text-red-400 hover:text-red-500/50',
                    ].join(' ')}
                    disabled={disabled}
                    aria-disabled={disabled}
                >
                    <Trash />
                </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle asChild>
                        <Text preset="headline">
                            {t('general:delete_confirmation.title')}
                        </Text>
                    </DialogTitle>
                    <DialogDescription asChild>
                        <Text>
                            {t('general:delete_confirmation.description')}
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
                                preset="secondary"
                                type="button"
                                onClick={() => setIsOpen(false)}
                            >
                                {capitalizeFirstLetter(t('general:cancel'))}
                            </Button>
                            <SubmitButton
                                preset="destructive"
                                title={t('general:delete')}
                            />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
