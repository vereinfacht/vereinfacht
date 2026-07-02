import Link from 'next/link';
import ListItem from './ListItem';
import Text from '@/app/components/Text/Text';
import { toKebabCase } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';

type NavigatableItem = {
    title: string;
    href: string;
    icon: React.ReactNode;
};

type GroupItem = {
    title: string;
    items: NavigatableItem[];
};

export type NavigationListItemType = NavigatableItem | GroupItem;

interface Props {
    items: NavigationListItemType[];
}

function getDataCy(item: NavigationListItemType) {
    return 'navigation-link-' + toKebabCase(item.title);
}

export default function List({ items }: Props) {
    const { t } = useTranslation('admin');

    return (
        <nav aria-label={t('main_navigation')} className="p-5">
            <ul className="flex flex-col gap-y-5">
                {items.map((item, index) => {
                    if ('items' in item) {
                        return (
                            <li key={index}>
                                <Text className="font py-2 text-xs leading-[1em] tracking-wide text-slate-800 uppercase">
                                    {item.title}
                                </Text>
                                <ul className="flex-col md:flex">
                                    {item.items?.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <Link
                                                href={subItem.href}
                                                data-cy={getDataCy(subItem)}
                                            >
                                                <ListItem
                                                    href={subItem.href}
                                                    title={subItem.title}
                                                    icon={subItem.icon}
                                                />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    }

                    return (
                        <li className="pl-4" key={index}>
                            <Link
                                href={item.href ?? '/'}
                                data-cy={getDataCy(item)}
                            >
                                <ListItem
                                    href={item.href}
                                    title={item.title}
                                    icon={item.icon}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
