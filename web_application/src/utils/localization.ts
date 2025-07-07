// also change in i18n.js and vice versa.
import { ResourceName } from '@/resources/resource';
import { camelCaseToSnakeCase, singularize } from './strings';

// be aware, that they are also used to map over translation fields
export const supportedLocales = ['en', 'de'] as const;
export const defaultLocale = supportedLocales[0];

export type SupportedLocale = (typeof supportedLocales)[number];

export function getLocalizedPath(
    pathname: string,
    locale: SupportedLocale,
    queryString?: string,
) {
    return `/${locale}${pathname}${queryString ?? ''}`;
}

export function getUnlocalizedPath(
    pathname: string,
    currentLocale: SupportedLocale,
) {
    return pathname.replace(`/${currentLocale}/`, '/');
}

export function getI18nNamespace(resourceName: ResourceName) {
    return camelCaseToSnakeCase(singularize(resourceName));
}

export function getAdminPath(pathname: string) {
    return pathname.split('/admin')[1];
}
