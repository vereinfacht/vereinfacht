'use client';

import Card from '@/app/components/Card/Card';
import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import { Badge } from '@/app/components/ui/badge';
import { CardContent, CardFooter, CardHeader } from '@/app/components/ui/card';
import { TFinanceAccountDeserialized } from '@/types/resources';
import { isPast } from 'date-fns';
import useTranslation from 'next-translate/useTranslation';
import { useQueryState } from 'nuqs';
import { paginationSearchParamParser } from '@/utils/search-params';
import SettingsDropdown from './settings-dropdown';
import IconCheck from '/public/svg/check.svg';

interface Props {
    title: string;
    account?: TFinanceAccountDeserialized;
    balance?: number;
}

export default function AccountCard({ balance, account, title }: Props) {
    const { t } = useTranslation();
    const [accountId, setAccountId] = useQueryState('accountId', {
        shallow: false,
    });
    const [_, setPage] = useQueryState('page', paginationSearchParamParser);
    const cardId = account ? account.id : null;
    const type =
        account && isPast(account.deletedAt ?? '') ? 'deactivated' : 'active';
    const isSelected = cardId === accountId;
    const readableIban = account?.iban
        ? account.iban.replace(/(.{4})/g, '$1 ').trim()
        : undefined;

    return (
        <Card
            hoverAnimations={false}
            className={[
                'group flex h-auto w-full flex-col border-2 border-transparent',
                isSelected
                    ? 'is-selected border-blue-500! transition-none'
                    : '',
                type === 'deactivated' && 'shadow-none',
                type === 'deactivated' && !isSelected
                    ? 'border-slate-200!'
                    : '',
            ].join(' ')}
        >
            <CardHeader className="p-4 pt-3 pb-1">
                <div className="flex w-full flex-1 items-center justify-between space-x-2">
                    <Text
                        tag="h3"
                        preset="headline"
                        className="text-base group-[.is-selected]:text-blue-500"
                        data-cy={`account-card-title-${cardId ? cardId : 'all'}`}
                    >
                        {title}
                    </Text>
                    <button
                        onClick={() => {
                            setAccountId(cardId);
                            setPage(null);
                        }}
                        className="p-1"
                        data-cy={`select-account-${cardId ? cardId : 'all'}`}
                    >
                        <div className="flex size-5 items-center justify-center rounded-full bg-white ring-2 ring-slate-200 transition-all group-[.is-selected]:border-transparent group-[.is-selected]:ring-2 group-[.is-selected]:ring-blue-500 hover:bg-blue-200 hover:ring-blue-500">
                            {isSelected && (
                                <IconCheck className="w-3 stroke-blue-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
                            )}
                        </div>
                    </button>
                </div>
            </CardHeader>
            {readableIban !== undefined &&
                account?.accountType === 'bank_account' && (
                    <CardContent className="flex w-full items-end justify-between space-x-2 p-4 pt-1 pb-3">
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
                                {t(
                                    `finance_account:account_type.${account.accountType}`,
                                )}
                            </Text>
                        </Badge>
                        <SettingsDropdown account={account} />
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
