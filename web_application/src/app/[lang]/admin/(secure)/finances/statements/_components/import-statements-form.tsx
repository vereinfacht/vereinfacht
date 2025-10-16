'use client';

import { importStatementsFormAction } from '@/actions/statements/import';
import Button from '@/app/components/Button/Button';
import Text from '@/app/components/Text/Text';
import { Input } from '@/app/components/ui/input';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import FormField from '../../../components/Form/FormField';
import FormStateHandler, {
    FormActionState,
} from '../../../components/Form/FormStateHandler';
import SubmitButton from '../../../components/Form/SubmitButton';
import Trans from 'next-translate/Trans';

interface Props {
    account: TFinanceAccountDeserialized;
    setIsOpen: (open: boolean) => void;
}

export default function ImportStatementsForm({ account, setIsOpen }: Props) {
    const { t } = useTranslation();
    const router = useRouter();
    const { id } = account;
    const extendedFormAction = importStatementsFormAction.bind(null, id);
    const [formState, formAction] = useFormState<FormActionState, FormData>(
        extendedFormAction,
        {
            success: false,
        },
    );

    const [file, setFile] = useState<File | null>(null);
    const [expectedData, setExpectedData] = useState<{
        statement_count: number;
        transaction_count: number;
    }>({
        statement_count: 0,
        transaction_count: 0,
    });
    const [isLoading, setIsLoading] = useState(false);

    const countTransactions = async (file: File) => {
        setIsLoading(true);
        const text = await file.text();

        return {
            statement_count: text
                .split(/\r?\n/)
                .filter((line) => line.startsWith(':20:')).length,
            transaction_count: text
                .split(/\r?\n/)
                .filter((line) => line.startsWith(':61:')).length,
        };
    };

    useEffect(() => {
        if (!file) {
            setExpectedData({
                statement_count: 0,
                transaction_count: 0,
            });
            return;
        }

        countTransactions(file)
            .then((data) => {
                setExpectedData(data);
                setIsLoading(false);
            })
            .catch(() => {
                setExpectedData({
                    statement_count: 0,
                    transaction_count: 0,
                });
                setIsLoading(false);
            });
    }, [file]);

    return (
        <form action={formAction} className="container flex flex-col gap-8">
            <FormStateHandler
                state={formState}
                translationKey="statements"
                type="action"
                onSuccess={() => {
                    setIsOpen(false);
                    router.refresh();
                }}
            />
            <FormField errors={formState.errors?.['file']}>
                <Input
                    className="mt-1 px-3 py-2 hover:bg-slate-50"
                    id="file"
                    name="file"
                    type="file"
                    accept=".mta"
                    multiple={false}
                    disabled={isLoading}
                    onChange={(event) => {
                        const files = event.target.files;

                        setFile(files ? files[0] : null);
                    }}
                    required
                />
            </FormField>

            {(expectedData.statement_count > 0 ||
                expectedData.transaction_count > 0) &&
                !isLoading && (
                    <Text>
                        <Trans
                            i18nKey={
                                'transaction:import.preview.exptected_data'
                            }
                            values={{
                                statement_count: expectedData.statement_count,
                                transaction_count:
                                    expectedData.transaction_count,
                            }}
                            components={[
                                <span key="0" className={'font-semibold'} />,
                                <span key="1" className={'font-semibold'} />,
                            ]}
                        />
                    </Text>
                )}

            <div className="flex gap-4 self-end">
                <Button
                    preset="secondary"
                    type="button"
                    onClick={() => setIsOpen(false)}
                >
                    {capitalizeFirstLetter(t('general:cancel'))}
                </Button>
                <SubmitButton title={t('general:import')} />
            </div>
        </form>
    );
}
