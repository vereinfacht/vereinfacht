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

    function getAlignClass(progressValue: number) {
        if (progressValue < 10) {
            return 'translate-x-0';
        }
        if (progressValue > 90) {
            return '-translate-x-full';
        }
        return '-translate-x-1/2';
    }

    return (
        <div className="flex gap-4 pt-4">
            <aside className="relative w-full">
                <ProgressBar
                    value={progressValue}
                    over={isOver}
                    ariaLabel="Transaction Progress"
                />
                {totalTransactionAmount !== 0 && (
                    <CurrencyText
                        className={`absolute bottom-0 -translate-y-6 ${getAlignClass(progressValue)}`}
                        style={{ left: `${progressValue / 2}%` }}
                        value={totalTransactionAmount}
                    />
                )}
                {totalTransactionAmount !== amount && (
                    <div
                        className={`absolute bottom-0 flex -translate-y-6 items-end gap-2 text-orange-400 ${getAlignClass(progressValue)}`}
                        style={{
                            left: `${progressValue + (100 - progressValue) / 2}%`,
                        }}
                    >
                        <CurrencyText
                            className="text-orange-400"
                            value={difference}
                        />
                        {isOver ? (
                            <Text className="w-full">zu viel</Text>
                        ) : (
                            <Text className="w-full">noch offen</Text>
                        )}
                    </div>
                )}
            </aside>

            <CurrencyText colorized={isMatch} value={amount} />
            {isMatch && <CircleCheck className="text-green-400" />}
        </div>
    );
}
