'use client';
import { useTranslations } from 'next-intl';

import type { FormAction } from '@/types/form-actions';
import Link from 'next/link';
import DeleteForm from './DeleteForm';
import IconPen from '/public/svg/edit.svg';
import { Button } from '@/app/components/ui/button';

interface Props {
    href?: string;
    onClick?: () => void;
    type?: 'edit' | 'delete';
    id?: string | number;
    deleteAction?: FormAction;
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
    const t = useTranslations();

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
                title={t(`general.${type}`)}
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
        <Button variant="tertiary" size="iconSm" asChild disabled={disabled}>
            <Link
                data-cy={`${type}-${id}-button`}
                href={href ?? ''}
                title={t(`general.${type}`)}
                aria-disabled={disabled}
                onClick={(e) => {
                    if (disabled) {
                        e.preventDefault();
                    }
                }}
            >
                {type === 'edit' && <IconPen />}
            </Link>
        </Button>
    );
}
