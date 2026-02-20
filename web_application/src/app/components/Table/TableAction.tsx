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
    disabled?: boolean;
}

export function TableAction({
    type = 'view',
    onClick,
    href,
    id,
    deleteAction,
    resourceName,
    disabled = false,
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
            className={[
                'transition-color duration-300',
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
            {type === 'view' ? (
                <IconEye {...iconProps} />
            ) : type === 'edit' ? (
                <IconPen {...iconProps} />
            ) : null}
        </Link>
    );
}
