'use client';

import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale/de';
import { enUS } from 'date-fns/locale/en-US';
import { CalendarDays, RotateCcw } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';
import { ParserBuilder, useQueryState } from 'nuqs';
import { useState } from 'react';
import { DayPicker, DateRange as DayPickerDateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '../DropdownMenu';
import Text from '../Text/Text';

interface Props {
    fromDateParser: ParserBuilder<string>;
    toDateParser: ParserBuilder<string>;
    translationKey: string;
    parameterKeys: {
        from: string;
        to: string;
    };
}

export function HeaderDatePicker({
    fromDateParser,
    toDateParser,
    translationKey,
    parameterKeys,
}: Props) {
    const { t } = useTranslation();
    const { lang } = useTranslation();
    const locale = lang === 'de' ? de : enUS;

    const [fromDate, setFromDate] = useQueryState(
        parameterKeys.from,
        fromDateParser,
    );
    const [toDate, setToDate] = useQueryState(parameterKeys.to, toDateParser);
    const [isOpen, setIsOpen] = useState(false);

    const [selectedRange, setSelectedRange] = useState<
        DayPickerDateRange | undefined
    >(() => {
        const from = fromDate ? parseISO(fromDate) : undefined;
        const to = toDate ? parseISO(toDate) : undefined;

        if (from || to) {
            return { from, to };
        }
        return undefined;
    });

    const hasActiveFilter = Boolean(
        (fromDate && fromDate !== '') || (toDate && toDate !== ''),
    );

    const handleApply = () => {
        if (selectedRange?.from) {
            setFromDate(format(selectedRange.from, 'yyyy-MM-dd'));
        } else {
            setFromDate(null);
        }

        if (selectedRange?.to) {
            setToDate(format(selectedRange.to, 'yyyy-MM-dd'));
        } else {
            setToDate(null);
        }

        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedRange(undefined);
        setFromDate(null);
        setToDate(null);
        setIsOpen(false);
    };

    const getCurrentSelectionText = () => {
        if (selectedRange?.from && selectedRange?.to) {
            return `${format(selectedRange.from, 'MMM dd', { locale })} - ${format(selectedRange.to, 'MMM dd, yyyy', { locale })}`;
        }
        if (selectedRange?.from) {
            return `${format(selectedRange.from, 'MMM dd, yyyy', { locale })}`;
        }
        if (selectedRange?.to) {
            return `${format(selectedRange.to, 'MMM dd, yyyy', { locale })}`;
        }
        const today = new Date();
        return `${format(today, 'MMM dd, yyyy', { locale })}`;
    };

    return (
        <div className="flex items-center gap-x-4">
            {t(`${translationKey}.label`)}

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="relative h-8 w-8 p-0 hover:bg-gray-100"
                        size="sm"
                    >
                        <CalendarDays className="h-4 w-4 text-gray-600" />
                        {hasActiveFilter && (
                            <Badge
                                className="absolute right-0 top-0 flex h-3 w-3 flex-col items-center justify-center rounded-full px-1 text-[10px] tabular-nums text-white"
                                variant="primary"
                            />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="flex flex-col gap-y-4 p-4">
                    <div className="space-y-4">
                        <Text>{getCurrentSelectionText()}</Text>

                        <div className="rounded-lg border p-4">
                            <DayPicker
                                mode="range"
                                selected={selectedRange}
                                onSelect={setSelectedRange}
                                numberOfMonths={2}
                                className="flex justify-center"
                                showOutsideDays={false}
                                locale={locale}
                                defaultMonth={
                                    selectedRange?.from ||
                                    (fromDate
                                        ? parseISO(fromDate)
                                        : undefined) ||
                                    new Date()
                                }
                            />
                        </div>

                        <div className="mt-2 flex gap-2">
                            <Button
                                onClick={handleApply}
                                className="flex-1"
                                disabled={
                                    !selectedRange?.from && !selectedRange?.to
                                }
                            >
                                {t('general:apply')}
                            </Button>
                            <Button onClick={handleClear} variant="outline">
                                <RotateCcw />
                            </Button>
                        </div>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
