'use client';

import CurrencyText from '@/app/components/Text/CurrencyText';
import Text from '@/app/components/Text/Text';
import ProgressBar from '@/app/components/ui/progress-bar';
import { CircleCheck } from 'lucide-react';
import { useMemo } from 'react';

interface Props {
    amount: number;
    totalTransactionAmount: number;
}

export default function TransactionProgressBar({
    amount,
    totalTransactionAmount,
}: Props) {
    const difference = Math.abs(totalTransactionAmount - amount);
    const isOver = Math.abs(totalTransactionAmount) > Math.abs(amount);
    const isUnder = Math.abs(totalTransactionAmount) < Math.abs(amount);

    const isMatch =
        totalTransactionAmount === amount &&
        amount !== 0 &&
        totalTransactionAmount !== 0;

    const progressValue = useMemo(() => {
        if (amount === 0 || totalTransactionAmount === 0) return 0;
        if (isOver || isUnder) {
            return Math.min(
                (Math.abs(amount) / (Math.abs(amount) + difference)) * 100,
                100,
            );
        }
        return 100;
    }, [amount, totalTransactionAmount]);

    return (
        <div className="flex gap-8 pt-12">
            <aside className="relative w-full">
                <ProgressBar
                    value={progressValue}
                    over={isOver}
                    ariaLabel="Transaction Progress"
                />
                {totalTransactionAmount !== 0 && (
                    <CurrencyText
                        className="absolute bottom-0 -translate-x-1/2 -translate-y-6"
                        style={{ left: `${progressValue / 2}%` }}
                        value={totalTransactionAmount}
                    />
                )}
                {totalTransactionAmount !== amount && (
                    <div
                        className="absolute bottom-0 flex -translate-x-1/2 -translate-y-6 items-end gap-2 text-orange-400"
                        style={{
                            left: `${progressValue + (100 - progressValue) / 2}%`,
                        }}
                    >
                        <CurrencyText
                            className="text-orange-400"
                            value={difference}
                        />
                        {isOver ? (
                            <Text>zu viel</Text>
                        ) : (
                            <Text>noch offen</Text>
                        )}
                    </div>
                )}
            </aside>

            <div className="flex items-center justify-end gap-2">
                <CurrencyText value={amount} />
                {isMatch && <CircleCheck className="text-green-400" />}
            </div>
        </div>
    );
}
