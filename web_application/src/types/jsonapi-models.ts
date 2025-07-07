import { SupportedLocale, supportedLocales } from '@/utils/localization';
import { z } from 'zod';

type TranslationSchemaEntry = z.ZodOptional<
    z.ZodUnion<[z.ZodString, z.ZodLiteral<''>]>
>;

export const TranslationSchema = z.object(
    supportedLocales.reduce(
        (acc, locale) => {
            acc[locale] = z.optional(
                z.string().min(2).max(255).or(z.literal('')),
            );
            return acc;
        },
        {} as Record<SupportedLocale, TranslationSchemaEntry>,
    ),
);

export type TranslationSchemaType = Record<string, TranslationSchemaEntry>;

export type TranslatableAttribute = z.infer<typeof TranslationSchema> | [];

export interface JsonApiMember {
    data: {
        id: string;
        type: string;
        attributes: {
            id?: string;
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
        };
        relationships: {
            club: [
                {
                    data: {
                        id: string;
                        type: string;
                    };
                },
            ];
            divisions: [
                {
                    data: {
                        id: string;
                        type: string;
                    };
                },
            ];
        };
    };
}

export interface JsonApiMembership {
    data: {
        id: string;
        type: string;
    };
}

export interface JsonApiMembershipType {
    data: {
        id: string;
        type: string;
        attributes: {
            id: string;
            title: string;
            description: string;
            admissionFee: number | null;
            monthlyFee: number;
            minimumNumberOfMonths: number;
            maximumNumberOfMembers: number;
            createdAt: string;
            updatedAt: string;
        };
    };
}

export interface JsonApiDivision {
    data: {
        id: string;
        type: string;
        attributes: {
            id: string;
            title: string;
            titleTranslation: TranslatableAttribute;
        };
    };
}

export interface JsonApiDivisionMembershipType {
    data: {
        id: string;
        type: string;
        attributes: {
            id: string;
            division_id: string;
            membership_type_id: string;
            monthlyFee: number;
            createdAt: string;
            updatedAt: string;
        };
    };
}

export interface JsonApiClub {
    data: [
        {
            id: string;
            type: string;
            attributes: {
                slug: string;
                title: string;
                extendedTitle: string;
                address: string;
                zipCode: string;
                city: string;
                country: string;
                email: string;
                primaryColor: string;
                logoUrl: string;
                privacyStatementUrl: string;
                contributionStatementUrl: string;
                constitutionUrl: string;
                createdAt: string;
                updatedAt: string;
            };
        },
    ];
}

export interface JsonApiUser {
    data: {
        id: string;
        type: string;
        attributes: {
            name: string;
            createdAt: string;
            updatedAt: string;
        };
    };
}
