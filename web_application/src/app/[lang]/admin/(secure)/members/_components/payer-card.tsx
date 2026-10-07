'use client';

import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import FormField from '../../components/Form/FormField';
import { FormActionState } from '../../components/Form/FormStateHandler';
import BelongsToSelectInput from '@/app/components/Input/BelongsToSelectInput';
import InputLabel from '@/app/components/Input/InputLabel';
import Text from '@/app/components/Text/Text';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/app/components/ui/tabs';
import { TMemberDeserialized } from '@/types/resources';
import IconBuilding from '/public/svg/building.svg';
import IconUser from '/public/svg/user.svg';
import ContactCard from './contact-card';

interface PayerCardProps {
    formPath: string;
    formState: FormActionState;
    fetchExistingMembersAction: (searchTerm?: string) => Promise<any>;
}

export default function PayerCard({
    formPath,
    formState,
    fetchExistingMembersAction,
}: PayerCardProps) {
    const { t } = useTranslation();
    const [mode, setMode] = useState<'create' | 'select'>('create');
    const [payerType, setPayerType] = useState<'person' | 'company'>('person');
    const [selectedPayer, setSelectedPayer] = useState<{
        value: string;
        label: string;
    } | null>(null);
    const handlePayerSelect = (selected: any) => {
        setSelectedPayer(selected);
    };

    return (
        <div className="rounded-2xl border bg-white p-6">
            <Text className="text-textPrimary text-lg font-bold">
                {t('contact:payer')}
            </Text>

            <Tabs
                value={mode}
                onValueChange={(value) => {
                    if (value === 'create' || value === 'select') {
                        setMode(value);
                    }
                }}
            >
                <TabsList className="my-5 w-full">
                    <TabsTrigger className="w-full" value="create">
                        {t('membership:create_new')}
                    </TabsTrigger>

                    <TabsTrigger className="w-full" value="select">
                        {t('membership:select')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                    <div className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 gap-x-8 lg:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <InputLabel
                                    forInput="payerType"
                                    value={t('contact:contact_type.label')}
                                    required
                                    className="text-textPrimary"
                                />

                                <RadioGroup
                                    id="payerType"
                                    className="flex w-full flex-row gap-3"
                                    value={payerType}
                                    onValueChange={(value) => {
                                        if (
                                            value === 'person' ||
                                            value === 'company'
                                        ) {
                                            setPayerType(value);
                                        }
                                    }}
                                >
                                    <RadioGroupItem
                                        className="w-full"
                                        value="person"
                                        icon={
                                            <IconUser className="text-textPrimary" />
                                        }
                                    >
                                        {t('contact:contact_type.person')}
                                    </RadioGroupItem>

                                    <RadioGroupItem
                                        className="w-full"
                                        value="company"
                                        disabled
                                        icon={
                                            <IconBuilding className="text-textPrimary" />
                                        }
                                    >
                                        {t('contact:company_name.label')}
                                    </RadioGroupItem>
                                </RadioGroup>
                            </div>
                        </div>

                        <ContactCard
                            contactType={payerType}
                            idPrefix="payer"
                            formPath={formPath}
                            errors={formState.errors}
                            errorPrefix="payer"
                            disabled={mode !== 'create'}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="select">
                    <FormField errors={formState.errors?.payer}>
                        <BelongsToSelectInput<TMemberDeserialized>
                            resourceName="payer"
                            resourceType="members"
                            label={t('contact:payer')}
                            required
                            action={fetchExistingMembersAction}
                            defaultValue={selectedPayer ? [selectedPayer] : []}
                            optionLabel={(item) => {
                                const payer = item as TMemberDeserialized & {
                                    id?: string;
                                    fullName?: string;
                                };

                                return (
                                    payer.fullName ||
                                    `${payer.firstName ?? ''} ${
                                        payer.lastName ?? ''
                                    }`.trim() ||
                                    payer.id ||
                                    ''
                                );
                            }}
                            onChange={handlePayerSelect}
                        />
                    </FormField>
                </TabsContent>
            </Tabs>
        </div>
    );
}
