import useTranslation from 'next-translate/useTranslation';
import Text from './Text/Text';
import { HTMLAttributes, PropsWithChildren } from 'react';

type Props = PropsWithChildren<HTMLAttributes<HTMLElement>>;

function Footer({ children, className: classOverrides, ...props }: Props) {
    const { t } = useTranslation('general');

    return (
        <footer
            className={['align-self-end p-6 pt-12', classOverrides].join(' ')}
            {...props}
        >
            {children}
            <nav>
                <ul className="flex gap-5">
                    <li>
                        <a
                            href="https://vereinfacht.digital/impressum"
                            target="_blank"
                        >
                            <Text className="text-xs text-slate-600">
                                {t('imprint')}
                            </Text>
                        </a>
                    </li>
                    <li>
                        <a
                            href="https://vereinfacht.digital/datenschutz"
                            target="_blank"
                        >
                            <Text className="text-xs text-slate-600">
                                {t('privacy')}
                            </Text>
                        </a>
                    </li>
                </ul>
            </nav>
        </footer>
    );
}

export default Footer;
