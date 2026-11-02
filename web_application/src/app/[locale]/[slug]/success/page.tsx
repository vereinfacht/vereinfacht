import { getTranslations } from 'next-intl/server';
import Text from '@/app/components/Text/Text';
import IconCheck from '/public/svg/check.svg';

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ membershipType: string }>;
}) {
    const t = await getTranslations();
    const { membershipType } = await searchParams;

    return (
        <div className="mx-auto max-w-xl flex-1 px-6 py-10 text-center">
            {t.rich('application.success.headline', {
                tag0: (chunks) => (
                    <Text
                        preset="default"
                        className="text-center text-slate-600"
                    >
                        {chunks}
                    </Text>
                ),
                tag1: () => <br />,
                tag2: (chunks) => (
                    <span className="font-semibold text-slate-900">
                        {chunks}
                    </span>
                ),
                membershipType,
            })}
            <IconCheck className="mx-auto my-10 h-12 w-12 border-2 border-transparent stroke-green-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
            <Text>{t('application.success.text')}</Text>
        </div>
    );
}
