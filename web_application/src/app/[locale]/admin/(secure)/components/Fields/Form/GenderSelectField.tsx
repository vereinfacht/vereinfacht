'use client';
import { useTranslations } from 'next-intl';

import { genderOptions } from '@/actions/financeContacts/create.schema';
import SelectInput, { Option } from '@/app/components/Input/SelectInput';
import React from 'react';
import FormField from '../../Form/FormField';

interface Props {
    errors?: string[];
    defaultValue: string;
}

function GenderSelectField({ errors, defaultValue }: Props) {
    const t = useTranslations();

    const genderSelectOptions: Option[] = genderOptions.map((option) => ({
        label: t(`general.gender.options.${option}`),
        value: option,
    }));

    genderSelectOptions.push({
        label: t('general.gender.options.none'),
        value: '',
    });

    return (
        <FormField errors={errors}>
            <SelectInput
                id="gender"
                name="gender"
                label={t('general.gender.label')}
                options={genderSelectOptions}
                defaultValue={defaultValue}
            />
        </FormField>
    );
}

export default GenderSelectField;
