'use client';

import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import { CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { useQueryState } from 'nuqs';
import SettingsDropdown from './settings-dropdown';
import { Badge } from '@/app/components/ui/badge';
import IconCheck from '/public/svg/check.svg';
import Card from '@/app/components/Card/Card';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    title: string;
    account?: TFinanceAccountDeserialized;
    balance?: number;
}

export default function AccountCard({ balance, account, title }: Props) {
    const { lang } = useTranslation();
    const [accountId, setAccountId] = useQueryState('accountId', {
        shallow: false,
    });
    const cardId = account ? account.id : null;
    const isSelected = cardId === accountId;
    const readableIban = account?.iban
        ? account.iban.replace(/(.{4})/g, '$1 ').trim() // adds a space every 4 characters
        : undefined;

    return (
        <Card
            hoverAnimations={false}
            className={[
                'group flex h-auto w-full flex-col bg-white',
                isSelected
                    ? 'is-selected ring-2 ring-blue-500 transition-none'
                    : '',
            ].join(' ')}
        >
            <CardHeader className="p-4 pb-1 pt-3">
                <div className="flex w-full flex-1 items-center justify-between space-x-2">
                    <Text
                        tag="h3"
                        preset="headline"
                        className="text-base group-[.is-selected]:text-blue-500"
                    >
                        {title}
                    </Text>
                    <button
                        onClick={() => setAccountId(cardId)}
                        className="p-1"
                    >
                        <div className="flex size-5 items-center justify-center rounded-full border bg-white transition-colors hover:border-blue-500 hover:bg-blue-200 group-[.is-selected]:border-transparent group-[.is-selected]:ring-2 group-[.is-selected]:ring-blue-500">
                            {isSelected && (
                                <IconCheck className="w-3 stroke-blue-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
                            )}
                        </div>
                    </button>
                </div>
            </CardHeader>
            {readableIban !== undefined && (
                <CardContent className="flex w-full items-end justify-between space-x-2 p-4 pb-3 pt-1">
                    <Text
                        preset="body-sm"
                        className="whitespace-nowrap text-slate-600"
                    >
                        {readableIban}
                    </Text>
                </CardContent>
            )}
            <CardFooter className="flex w-full items-end justify-between space-x-2 p-4 pt-1">
                {account !== undefined && (
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant="secondary"
                            className="whitespace-nowrap text-slate-600"
                        >
                            <Text preset="body-sm">
                                {account.type?.titleTranslations?.[lang]}
                            </Text>
                        </Badge>
                        {cardId !== null && <SettingsDropdown />}
                    </div>
                )}
                <CurrencyText
                    value={balance ?? 0}
                    className="w-full justify-self-end text-lg"
                ></CurrencyText>
            </CardFooter>
        </Card>
    );
}
