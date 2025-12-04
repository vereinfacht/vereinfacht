'use client';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import DeleteForm from './DeleteForm';
import IconEye from '/public/svg/eye.svg';
import IconPen from '/public/svg/pen.svg';

interface Props {
    href?: string;
    onClick?: () => void;
    type?: 'view' | 'edit' | 'delete';
    id?: string | number;
    deleteAction?: (formData: FormData) => Promise<FormActionState>;
    resourceName?: string;
}

export function TableAction({
    type = 'view',
    onClick,
    href,
    id,
    deleteAction,
    resourceName,
}: Props) {
    const { t } = useTranslation();
    const iconProps = {
        className:
            'stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
    };

    if (type === 'delete') {
        return (
            <DeleteForm
                deleteAction={deleteAction}
                id={id}
                translationKey={resourceName}
            />
        );
    }

    if (onClick && href === undefined) {
        return (
            <button
                title={t(`general:${type}`)}
                onClick={onClick}
                className="transition-color text-blue-500 duration-300 hover:text-blue-500/50"
            >
                {type === 'view' ? (
                    <IconEye {...iconProps} />
                ) : (
                    <IconPen {...iconProps} />
                )}
            </button>
        );
    }

    return (
        <Link
            data-cy={`${type}-${id}-button`}
            href={href ?? ''}
            title={t(`general:${type}`)}
            className="transition-color text-blue-500 duration-300 hover:text-blue-500/50"
        >
            {type === 'view' ? (
                <IconEye {...iconProps} />
            ) : type === 'edit' ? (
                <IconPen {...iconProps} />
            ) : null}
        </Link>
    );
}
