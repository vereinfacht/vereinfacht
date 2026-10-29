'use client';

import { FinanceAccountType } from '@/actions/financeAccounts/create.schema';
import Card from '@/app/components/Card/Card';
import Text from '@/app/components/Text/Text';
import { Coins, Landmark } from 'lucide-react';

interface Props {
    title: string;
    type: FinanceAccountType;
    onClick: () => void;
}

export default function AccountTypeCard({ title, type, onClick }: Props) {
    const icon =
        type === 'cash_box' ? (
            <Coins size="4em" className="text-blue-500" />
        ) : (
            <Landmark size="4em" className="text-blue-500" />
        );

    return (
        <button className="aspect-square" onClick={onClick}>
            <Card className="flex h-full flex-col items-center justify-center gap-[2em] border-4 border-transparent bg-slate-100 p-4 hover:border-blue-500">
                {icon}
                <Text preset="headline" className="text-[1.75em]">
                    {title}
                </Text>
            </Card>
        </button>
    );
}
