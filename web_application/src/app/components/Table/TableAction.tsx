'use client';

import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import IconEye from '/public/svg/eye.svg';
import IconPen from '/public/svg/pen.svg';

interface Props {
    href: string;
    type?: 'view' | 'edit';
}

export function TableAction({ type = 'view', href }: Props) {
    const { t } = useTranslation();
    const iconProps = {
        className:
            'stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round]',
    };

    return (
        <Link
            href={href}
            title={t(`general:${type}`)}
            className="transition-color text-blue-500 duration-300 hover:text-blue-500/50"
        >
            {type === 'view' ? (
                <IconEye {...iconProps} />
            ) : (
                <IconPen {...iconProps} />
            )}
        </Link>
    );
}
