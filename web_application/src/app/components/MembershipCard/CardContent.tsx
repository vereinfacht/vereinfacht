import { MembershipType } from '@/types/models';
import Trans from 'next-translate/Trans';
import DivisionList from '../DivisionList/DivisionList';
import CardItem from './CardItem';
import Text from '../Text/Text';
import styles from './CardContent.module.css';
import { useMembershipSwiper } from '@/hooks/membershipSwiper/useMembershipSwiper';
import useCurrency from '@/hooks/useCurrency';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    membershipType: MembershipType;
    showMonthCount: boolean;
    showAdmissionFee: boolean;
}

export default function CardContent({
    membershipType,
    showMonthCount,
    showAdmissionFee,
}: Props) {
    const { t } = useTranslation();
    const { getFormatted } = useCurrency();
    const { divisions: clubDivisions } = useMembershipSwiper();

    const {
        description,
        minimumNumberOfMembers,
        maximumNumberOfMembers,
        minimumNumberOfMonths,
    } = membershipType;

    const personCountProps =
        minimumNumberOfMembers !== maximumNumberOfMembers
            ? {
                  i18nKey: 'membership:person_count_range',
                  values: {
                      minimum: minimumNumberOfMembers,
                      maximum: maximumNumberOfMembers,
                  },
              }
            : {
                  i18nKey: 'membership:person_count',
                  values: {
                      count: maximumNumberOfMembers,
                  },
              };

    return (
        <div className="flex-1">
            <div className="flex flex-col gap-4 px-8 pt-4">
                {showMonthCount && (
                    <CardItem>
                        <Trans
                            i18nKey="membership:minimum_month_count"
                            components={[
                                <span key="0" className={'font-semibold'} />,
                            ]}
                            values={{ count: minimumNumberOfMonths }}
                        />
                    </CardItem>
                )}
                {showAdmissionFee && (
                    <CardItem>
                        {membershipType.admissionFee != null &&
                        membershipType.admissionFee > 0 ? (
                            <>
                                <span className="font-semibold">
                                    {getFormatted(
                                        membershipType.admissionFee ?? 0,
                                    )}
                                </span>{' '}
                                {t('membership_type:admission_fee.label')}
                            </>
                        ) : (
                            t('membership_type:no_admission_fee.label')
                        )}
                    </CardItem>
                )}
                <CardItem>
                    <Trans
                        components={[
                            <span key="0" className={'font-semibold'} />,
                        ]}
                        {...personCountProps}
                    />
                </CardItem>
            </div>
            {clubDivisions !== undefined && clubDivisions.length > 0 && (
                <DivisionList
                    clubDivisions={clubDivisions}
                    divisionMembershipTypes={
                        membershipType.divisionMembershipTypes
                    }
                />
            )}
            <div className="px-8">
                {Boolean(description) && (
                    <Text className="mb-8 mt-6 text-center">
                        <span
                            className={styles.description}
                            dangerouslySetInnerHTML={{
                                __html: description,
                            }}
                        />
                    </Text>
                )}
            </div>
        </div>
    );
}
