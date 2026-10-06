'use client';

import useTranslation from 'next-translate/useTranslation';

import FormField from '@/app/[lang]/admin/(secure)/components/Form/FormField';
import Checkbox from '@/app/components/Input/Checkbox';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';

interface ContactCardProps {
    contactType: 'person' | 'company';
    idPrefix: string;
    formPath: string;
    errors?: Record<string, string[]>;
    errorPrefix?: string;
    disabled?: boolean;
    showSameAddressOption?: boolean;
    useSameAddress?: boolean;
    onUseSameAddressChange?: (checked: boolean) => void;
    sameAddressLabel?: string;
}

export default function ContactCard({
    contactType,
    idPrefix,
    formPath,
    errors,
    errorPrefix,
    disabled = false,
    showSameAddressOption = false,
    useSameAddress = false,
    onUseSameAddressChange,
    sameAddressLabel,
}: ContactCardProps) {
    const { t } = useTranslation();

    const isCompany = contactType === 'company';

    const genderOptions = [
        {
            value: '',
            label: t('general:gender.options.none'),
        },
        {
            value: 'male',
            label: t('general:gender.options.male'),
        },
        {
            value: 'female',
            label: t('general:gender.options.female'),
        },
        {
            value: 'other',
            label: t('general:gender.options.other'),
        },
    ];

    const getError = (field: string) => {
        if (!errors || !errorPrefix) {
            return undefined;
        }

        return errors[`${errorPrefix}.${field}`];
    };

    return (
        <div className="flex flex-col gap-5">
            {isCompany && (
                <>
                    <TextInput
                        id={`${idPrefix}_companyName`}
                        name={`${formPath}[companyName]`}
                        label={t('contact:company_name.label')}
                        required
                        disabled={disabled}
                    />

                    <span className="text-textPrimary text-sm font-medium">
                        {t('contact:contact_person.label')}
                    </span>
                </>
            )}

            <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                <FormField errors={getError('firstName')}>
                    <TextInput
                        id={`${idPrefix}_firstName`}
                        name={`${formPath}[firstName]`}
                        label={t('contact:first_name.label')}
                        required
                        disabled={disabled}
                        error={!!getError('firstName')}
                    />
                </FormField>

                <FormField errors={getError('lastName')}>
                    <TextInput
                        id={`${idPrefix}_lastName`}
                        name={`${formPath}[lastName]`}
                        label={t('contact:last_name.label')}
                        required
                        disabled={disabled}
                        error={!!getError('lastName')}
                    />
                </FormField>
            </div>

            {!isCompany && (
                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <FormField errors={getError('birthday')}>
                        <TextInput
                            id={`${idPrefix}_birthday`}
                            name={`${formPath}[birthday]`}
                            type="date"
                            label={t('member:birthday.label')}
                            disabled={disabled}
                            error={!!getError('birthday')}
                            required
                        />
                    </FormField>

                    <FormField errors={getError('gender')}>
                        <SelectInput
                            id={`${idPrefix}_gender`}
                            name={`${formPath}[gender]`}
                            label={t('general:gender.label')}
                            options={genderOptions}
                            disabled={disabled}
                            error={!!getError('gender')}
                        />
                    </FormField>
                </div>
            )}

            {isCompany && (
                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                    <SelectInput
                        id={`${idPrefix}_gender`}
                        name={`${formPath}[gender]`}
                        label={t('general:gender.label')}
                        options={genderOptions}
                        required
                        disabled={disabled}
                    />
                </div>
            )}

            {showSameAddressOption && (
                <Checkbox
                    id={`${idPrefix}_useSameAddress`}
                    name={`${formPath}[useSameAddressAsMember1]`}
                    label={sameAddressLabel ?? ''}
                    defaultValue={useSameAddress}
                    handleChange={(event) =>
                        onUseSameAddressChange?.(event.target.checked)
                    }
                    disabled={disabled}
                />
            )}

            {!useSameAddress && (
                <>
                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        <FormField errors={getError('email')}>
                            <TextInput
                                id={`${idPrefix}_email`}
                                name={`${formPath}[email]`}
                                type="email"
                                label={t('general:email')}
                                required
                                disabled={disabled}
                                error={!!getError('email')}
                            />
                        </FormField>

                        <FormField errors={getError('phoneNumber')}>
                            <TextInput
                                id={`${idPrefix}_phoneNumber`}
                                name={`${formPath}[phoneNumber]`}
                                label={t('member:phone_number.label')}
                                disabled={disabled}
                                error={!!getError('phoneNumber')}
                            />
                        </FormField>
                    </div>

                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        <FormField errors={getError('address')}>
                            <TextInput
                                id={`${idPrefix}_address`}
                                name={`${formPath}[address]`}
                                label={t('member:address.label')}
                                required={isCompany}
                                disabled={disabled}
                                error={!!getError('address')}
                            />
                        </FormField>

                        <FormField errors={getError('zipCode')}>
                            <TextInput
                                id={`${idPrefix}_zipCode`}
                                name={`${formPath}[zipCode]`}
                                label={t('contact:zip_code.label')}
                                required
                                disabled={disabled}
                                error={!!getError('zipCode')}
                            />
                        </FormField>
                    </div>

                    <div className="grid gap-x-8 gap-y-4 lg:grid-cols-2">
                        <FormField errors={getError('city')}>
                            <TextInput
                                id={`${idPrefix}_city`}
                                name={`${formPath}[city]`}
                                label={t('contact:city.label')}
                                required
                                disabled={disabled}
                                error={!!getError('city')}
                            />
                        </FormField>

                        <FormField errors={getError('country')}>
                            <TextInput
                                id={`${idPrefix}_country`}
                                name={`${formPath}[country]`}
                                label={t('contact:country.label')}
                                required
                                disabled={disabled}
                                error={!!getError('country')}
                            />
                        </FormField>
                    </div>
                </>
            )}
        </div>
    );
}
