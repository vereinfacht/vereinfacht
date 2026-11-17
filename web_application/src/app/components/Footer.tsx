import { useTranslations } from 'next-intl';
import { HTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<HTMLAttributes<HTMLElement>>;

function Footer({ children, className: classOverrides, ...props }: Props) {
    const t = useTranslations();

    return (
        <footer className={['pt-12', classOverrides].join(' ')} {...props}>
            {children}
        </footer>
    );
}

export default Footer;
