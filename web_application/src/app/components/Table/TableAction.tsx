'use client';

import { FormActionState } from '@/app/[lang]/admin/(secure)/components/Form/FormStateHandler';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import DeleteForm from './DeleteForm';
import IconPen from '/public/svg/edit.svg';

interface Props {
    href?: string;
    onClick?: () => void;
    type?: 'edit' | 'delete';
    id?: string | number;
    deleteAction?: (formData: FormData) => Promise<FormActionState>;
    resourceName?: string;
    disabled?: boolean;
}

export function TableAction({
    type = 'edit',
    onClick,
    href,
    id,
    deleteAction,
    resourceName,
    disabled = false,
}: Props) {
    const { t } = useTranslation();

    if (type === 'delete') {
        return (
            <DeleteForm
                deleteAction={deleteAction}
                id={id}
                disabled={disabled}
                translationKey={resourceName}
            />
        );
    }

    if (onClick && href === undefined) {
        return (
            <button
                title={t(`general:${type}`)}
                className={[
                    'transition-color duration-300',
                    disabled
                        ? 'cursor-not-allowed opacity-30'
                        : 'text-blue-500 hover:text-blue-500/50',
                ].join(' ')}
                disabled={disabled}
                aria-disabled={disabled}
                onClick={(e) => {
                    if (disabled) {
                        e.preventDefault();
                    } else {
                        onClick();
                    }
                }}
            >
                {type === 'edit' && <IconPen />}
            </button>
        );
    }

    return (
        <Link
            data-cy={`${type}-${id}-button`}
            href={href ?? ''}
            title={t(`general:${type}`)}
            className={[
                'transition-color p-2 duration-300',
                disabled
                    ? 'cursor-not-allowed opacity-30'
                    : 'text-blue-500 hover:text-blue-500/50',
            ].join(' ')}
            aria-disabled={disabled}
            onClick={(e) => {
                if (disabled) {
                    e.preventDefault();
                }
            }}
        >
            {type === 'edit' && <IconPen />}
        </Link>
    );
}
