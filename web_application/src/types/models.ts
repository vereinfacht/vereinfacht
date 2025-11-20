import { TranslatableAttribute } from './jsonapi-models';
import { TTaxAccountDeserialized } from './resources';

export interface Model {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ResourceModel {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface Division extends ResourceModel {
    title: string;
    titleTranslations?: TranslatableAttribute;
}

export interface Member extends Model {
    firstName: string;
    lastName: string;
    gender: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    birthday: string;
    phoneNumber: string;
    email: string;
    divisions?: Division[] | [];
    hasConsentedMediaPublication?: boolean;
}

export type MembershipStatus = 'applied' | 'active' | 'canceled';

export interface Membership extends Model {
    bankIban: string;
    bankAccountHolder: string;
    startedAt: string;
    endedAt?: string;
    notes?: string;
    owner?: Member;
    status?: MembershipStatus;
    membershipType: MembershipType;
    paymentPeriod?: PaymentPeriod;
    monthlyFee?: number;
    voluntaryContribution?: number | null;
}

export interface MembershipType extends ResourceModel {
    index: number; // used for pattern
    title: string;
    titleTranslations?: TranslatableAttribute;
    description: string;
    descriptionTranslations?: TranslatableAttribute;
    admissionFee: number | null;
    monthlyFee: number;
    minimumNumberOfMonths: number;
    minimumNumberOfMembers: number;
    maximumNumberOfMembers: number;
    divisions?: Division[] | [];
    divisionMembershipTypes?: DivisionMembershipType[] | [];
}

export interface DivisionMembershipType extends Model {
    monthlyFee?: number;
    division?: Division;
}

export interface PaymentPeriod extends Model {
    title: string;
    rrule: string;
}

export type MembershipStartCycleType = 'daily' | 'monthly';

export interface Club extends Model {
    type: string;
    title: string;
    extendedTitle: string;
    applyTitle?: string;
    applyUrl?: string;
    address: string;
    zipCode: string;
    city: string;
    country: string;
    email: string;
    websiteUrl?: string;
    primaryColor: string;
    logoUrl: string;
    privacyStatementUrl: string;
    contributionStatementUrl: string;
    constitutionUrl: string;
    allowVoluntaryContribution: boolean;
    membershipStartCycleType: MembershipStartCycleType;
    hasConsentedMediaPublicationIsRequired: boolean;
    hasConsentedMediaPublicationDefaultValue: boolean;
    taxAccountChart?: TTaxAccountDeserialized;
    taxAccountChartSource: string;
    divisions: Division[] | [];
    membershipTypes: MembershipType[] | [];
    paymentPeriods?: PaymentPeriod[] | [];
}
