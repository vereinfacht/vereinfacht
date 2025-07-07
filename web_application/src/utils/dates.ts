import { MembershipStartCycleType } from './../types/models';
import { Locale, addMonths, format, formatISO } from 'date-fns';
import { enGB, de } from 'date-fns/locale';
import { SupportedLocale } from './localization';

const dateFnsLocales: Record<SupportedLocale, Locale> = { en: enGB, de };

export function getDefaultStartedAtInputValue(
    membershipStartCycleType: MembershipStartCycleType,
) {
    let date = new Date();

    if (membershipStartCycleType === 'monthly') {
        date = addMonths(date, 1);
        return format(date, 'yyyy-MM');
    }

    return formatISO(date, { representation: 'date' });
}

export function formatDateToInputValue(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function formatDate(
    date: string | Date | number | undefined,
    locale: SupportedLocale,
    formatStr = 'PP',
) {
    if (!date) {
        return '';
    }

    return format(date, formatStr, { locale: dateFnsLocales[locale] });
}
