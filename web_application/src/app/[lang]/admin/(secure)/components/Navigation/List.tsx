import Link from 'next/link';
import ListItem from './ListItem';
import Text from '@/app/components/Text/Text';
import { toKebabCase } from '@/utils/strings';

type NavigatableItem = {
    title: string;
    href: string;
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
    return (
        <nav className="py-6 pl-2 pr-9">
            {/* <MobileMenu items={items} /> */}

            <ul className="hidden flex-col gap-y-6 md:flex">
                {items.map((item, index) => {
                    if ('items' in item) {
                        return (
                            <li className="mt-4 pl-4" key={index}>
                                <Text className="font leading-[1em] tracking-wide text-slate-800">
                                    {item.title}
                                </Text>
                                <ul className="flex-col gap-y-6 pt-4 md:flex">
                                    {item.items?.map((subItem, subIndex) => (
                                        <li key={subIndex}>
                                            <Link
                                                href={subItem.href}
                                                data-cy={getDataCy(subItem)}
                                            >
                                                <ListItem
                                                    href={subItem.href}
                                                    title={subItem.title}
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
                                <ListItem href={item.href} title={item.title} />
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
