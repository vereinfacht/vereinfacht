import Empty from '@/app/components/Empty';
import Text from '@/app/components/Text/Text';
import { SupportedLocale, supportedLocales } from '@/utils/localization';
import React from 'react';

export type Translation = Record<SupportedLocale, string>;

interface Props {
    value: Translation;
}

export default function TranslationField({ value }: Props) {
    if (
        value === null ||
        value === undefined ||
        Object.keys(value).length === 0
    ) {
        return <Empty text={'–'} />;
    }

    return (
        <div className="flex flex-col gap-2">
            {supportedLocales.map((locale) => {
                const translation = value[locale];

                return (
                    <div key={locale} className="flex gap-2">
                        <Text preset="label" className="mt-[0.12em] w-[2em]">
                            {locale}
                        </Text>
                        <div className="flex-1">
                            {translation ? (
                                <Text data-cy={`${locale}-translation-text`}>
                                    {translation}
                                </Text>
                            ) : (
                                <Empty text={'–'} />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
