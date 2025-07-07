'use client';

import useTranslation from 'next-translate/useTranslation';
import React, { ButtonHTMLAttributes } from 'react';
import Text from '../Text/Text';
import IconPen from '/public/svg/pen.svg';

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Edit(props: Props) {
    const { t } = useTranslation();

    return (
        <button
            className="flex text-slate-600"
            {...props}
            type={props.type ?? 'button'}
        >
            <Text preset="label">{t('general:edit')}</Text>
            <IconPen className="ml-1 stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
        </button>
    );
}
