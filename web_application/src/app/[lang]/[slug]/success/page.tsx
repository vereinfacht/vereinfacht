import Text from '@/app/components/Text/Text';
import Trans from 'next-translate/Trans';
import useTranslation from 'next-translate/useTranslation';
import IconCheck from '/public/svg/check.svg';

export default function SuccessPage({
    searchParams,
}: {
    searchParams: { membershipType: string };
}) {
    const { t } = useTranslation('application');
    const { membershipType } = searchParams;
    return (
        <div className="mx-auto max-w-xl flex-1 px-6 py-10 text-center">
            <Trans
                i18nKey="application:success.headline"
                components={[
                    <Text
                        key="0"
                        preset="default"
                        className="text-center text-slate-600"
                    />,
                    <br key="1" />,
                    <span key="2" className={'font-semibold text-slate-900'} />,
                ]}
                values={{
                    membershipType,
                }}
            />
            <IconCheck className="mx-auto my-10 h-12 w-12 border-2 border-transparent stroke-green-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]" />
            <Text>{t('success.text')}</Text>
        </div>
    );
}
