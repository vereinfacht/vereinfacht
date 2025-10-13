'use client';

import { MediaInput } from '@/app/components/Input/MediaInput';
import useTranslation from 'next-translate/useTranslation';
import ActionForm from '../../../components/Form/ActionForm';

export default function ImportTransactionForm() {
    const { t } = useTranslation();

    return (
        <ActionForm
            state="import"
            action={'/api/finances/transactions/import'}
            type="create"
            translationKey="transaction"
        >
            <MediaInput
                id="receipt-file"
                label={t('transaction:file.label')}
                help={t('transaction:file.help')}
                name="media"
                required
                accept={'.txt'}
            />
        </ActionForm>
    );
}
