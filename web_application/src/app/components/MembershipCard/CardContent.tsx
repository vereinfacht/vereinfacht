import { useTranslations } from 'next-intl';
import { MembershipType } from '@/types/models';
import DivisionList from '../DivisionList/DivisionList';
import CardItem from './CardItem';
import Text from '../Text/Text';
import styles from './CardContent.module.css';
import { useMembershipSwiper } from '@/hooks/membershipSwiper/useMembershipSwiper';
import useCurrency from '@/hooks/useCurrency';
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
    const t = useTranslations();
    const { getFormatted } = useCurrency();
    const { divisions: clubDivisions } = useMembershipSwiper();

    const {
        description,
        minimumNumberOfMembers,
        maximumNumberOfMembers,
        minimumNumberOfMonths,
    } = membershipType;

    return (
        <div className="flex-1">
            <div className="flex flex-col gap-4 px-8 pt-4">
                {showMonthCount && (
                    <CardItem>
                        {t.rich('membership.minimum_month_count', {
                            count: minimumNumberOfMonths,
                            tag0: (chunks) => (
                                <span className="font-semibold">{chunks}</span>
                            ),
                        })}
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
                                {t('membership_type.admission_fee.label')}
                            </>
                        ) : (
                            t('membership_type.no_admission_fee.label')
                        )}
                    </CardItem>
                )}
                <CardItem>
                    {minimumNumberOfMembers !== maximumNumberOfMembers
                        ? t.rich('membership.person_count_range', {
                              minimum: minimumNumberOfMembers,
                              maximum: maximumNumberOfMembers,
                              tag0: (chunks) => (
                                  <span className="font-semibold">
                                      {chunks}
                                  </span>
                              ),
                          })
                        : t.rich('membership.person_count', {
                              count: maximumNumberOfMembers,
                              tag0: (chunks) => (
                                  <span className="font-semibold">
                                      {chunks}
                                  </span>
                              ),
                          })}
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
                    <Text className="mt-6 mb-8 text-center">
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
