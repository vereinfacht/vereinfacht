'use client';

import Checkbox from '@/app/components/Input/Checkbox';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import { sortOptions } from '@/app/components/MultiselectInput/MultiselectInput';
import { FormMember } from '@/hooks/application/ApplicationProvider';
import useTranslation from 'next-translate/useTranslation';
import { ChangeEvent, useState } from 'react';

interface PersonFormProps {
    index: number;
    member: FormMember;
    hideContactAndAddress?: boolean;
    hasConsentedMediaPublicationIsRequired: boolean;
}

export default function PersonForm({
    member,
    index,
    hideContactAndAddress = false,
    hasConsentedMediaPublicationIsRequired = false,
}: PersonFormProps) {
    const { t } = useTranslation();
    const [showContactAndAddress, setShowContactAndAddress] = useState(
        hideContactAndAddress,
    );
    const [formData, setFormData] = useState<FormMember>(member);

    const sortedGenderOptions = sortOptions([
        {
            value: '',
            label: t('member:gender_options.none'),
        },
        {
            value: 'male',
            label: t('member:gender_options.male'),
        },
        {
            value: 'female',
            label: t('member:gender_options.female'),
        },
        {
            value: 'other',
            label: t('member:gender_options.other'),
        },
    ]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const propertyName = name.split('.')[2];
        setFormData({ ...formData, [propertyName]: value });
    };

    return (
        <div className="md:flex md:gap-12" key={`persons-${index}`}>
            <div className="flex-1 space-y-4">
                <TextInput
                    label={t('member:first_name.label')}
                    id={`firstName-${index}`}
                    name={`members.${index}.firstName`}
                    value={formData.firstName}
                    onChange={handleInputChange}
                    autoComplete="given-name"
                    required
                />
                <TextInput
                    id={`lastName-${index}`}
                    label={t('member:last_name.label')}
                    name={`members.${index}.lastName`}
                    value={formData.lastName}
                    onChange={handleInputChange}
                    autoComplete="family-name"
                    required
                />
                <div className="flex justify-between">
                    <div className="w-1/2 pr-2.5">
                        <TextInput
                            id={`birthday-${index}`}
                            label={t('member:birthday')}
                            type="date"
                            name={`members.${index}.birthday`}
                            value={formData.birthday}
                            onChange={handleInputChange}
                            autoComplete="bday"
                            required
                        />
                    </div>
                    <div className="w-1/2 pl-2.5">
                        <SelectInput
                            id={`gender-${index}`}
                            name={`members.${index}.gender`}
                            label={t('member:gender')}
                            defaultValue={formData.gender}
                            autoComplete="sex"
                            options={sortedGenderOptions}
                        />
                    </div>
                </div>
                <Checkbox
                    id={`members.${index}.hasConsentedMediaPublication`}
                    name={`members.${index}.hasConsentedMediaPublication`}
                    defaultValue={formData.hasConsentedMediaPublication}
                    required={hasConsentedMediaPublicationIsRequired}
                    handleChange={(event) => {
                        setFormData({
                            ...formData,
                            hasConsentedMediaPublication: event.target.checked,
                        });
                    }}
                >
                    {/**
                     *  @note: this should not use dangerouslySetInnerHTML when we make the name dynamic!!
                     */}
                    <span
                        dangerouslySetInnerHTML={{
                            __html: t('member:label_consent_media_publication'),
                        }}
                    />
                </Checkbox>
                {Boolean(index > 0) && (
                    <Checkbox
                        id={`members.${index}.sameContactAndAddress`}
                        name={`members.${index}.sameContactAndAddress`}
                        value="true"
                        defaultValue={showContactAndAddress}
                        handleChange={() =>
                            setShowContactAndAddress(!showContactAndAddress)
                        }
                    >
                        {/**
                         *  @note: this should not use dangerouslySetInnerHTML when we make the name dynamic!!
                         */}
                        <span
                            dangerouslySetInnerHTML={{
                                __html: t(
                                    'member:label_identical_information',
                                    {
                                        name: 'Person&nbsp;1',
                                    },
                                ),
                            }}
                        />
                    </Checkbox>
                )}
            </div>

            <div className="mt-4 flex-1 space-y-4 md:mt-0">
                {!showContactAndAddress && (
                    <>
                        <TextInput
                            id={`email-${index}`}
                            label={t('general:email')}
                            name={`members.${index}.email`}
                            value={formData.email}
                            onChange={handleInputChange}
                            autoComplete="email"
                            required
                        />
                        <TextInput
                            id={`phoneNumber-${index}`}
                            label={t('member:phone')}
                            name={`members.${index}.phoneNumber`}
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            autoComplete="tel"
                        />

                        <TextInput
                            id={`address-${index}`}
                            label={t('member:address')}
                            name={`members.${index}.address`}
                            value={formData.address}
                            onChange={handleInputChange}
                            autoComplete="street-address"
                            required
                        />
                        <div className="flex justify-between">
                            <div className="w-1/3">
                                <TextInput
                                    id={`zipCode-${index}`}
                                    label={t('member:zip_code')}
                                    name={`members.${index}.zipCode`}
                                    value={formData.zipCode}
                                    onChange={handleInputChange}
                                    autoComplete="postal-code"
                                    required
                                />
                            </div>
                            <div className="w-2/3 pl-5">
                                <TextInput
                                    id={`city-${index}`}
                                    label={t('member:city')}
                                    name={`members.${index}.city`}
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    autoComplete="home city"
                                    required
                                />
                            </div>
                        </div>
                        <SelectInput
                            id={`country-${index}`}
                            name={`members.${index}.country`}
                            defaultValue={formData.country}
                            label={t('member:country')}
                            className="w-full"
                            autoComplete="country-name"
                            required
                            options={[
                                {
                                    value: 'germany',
                                    label: t('member:country_options.germany'),
                                },
                                {
                                    value: 'denmark',
                                    label: t('member:country_options.denmark'),
                                },
                            ]}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
