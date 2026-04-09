'use client';

import TextInput from '@/app/components/Input/TextInput';
import { updateDivisionMembershipTypeFormAction } from '@/actions/divisionMembershipTypes/update';
import { TDivisionMembershipTypeDeserialized } from '@/types/resources';
import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';

interface Props {
    divisionMembershipType: TDivisionMembershipTypeDeserialized;
    membershipTypeId: string;
    onClose: () => void;
}

export default function EditableMonthlyFeeCell({
    divisionMembershipType,
    membershipTypeId,
    onClose,
}: Props) {
    const [value, setValue] = useState(
        divisionMembershipType.monthlyFee?.toString() || '',
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const boundAction = updateDivisionMembershipTypeFormAction.bind(
        null,
        divisionMembershipType.id,
    );
    const [state, formAction] = useFormState(boundAction, { success: false });

    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [onClose, state.success]);

    useEffect(() => {
        if (!state.success && state.errors) {
            setIsSubmitting(false);
        }
    }, [state.errors, state.success]);

    const submitIfNeeded = (form?: HTMLFormElement | null) => {
        if (!form || isSubmitting) {
            return;
        }

        const originalValue = divisionMembershipType.monthlyFee?.toString() || '';

        if (value === originalValue) {
            onClose();
            return;
        }

        setIsSubmitting(true);
        form.requestSubmit();
    };

    return (
        <form action={formAction} className="flex w-fit ml-auto items-center gap-2">
            <input
                type="hidden"
                name="relationships[division][divisions]"
                value={divisionMembershipType.division?.id || ''}
            />
            <input
                type="hidden"
                name="relationships[membershipType][membership-types]"
                value={membershipTypeId}
            />
            <TextInput
                id="monthlyFee"
                autoFocus
                type="number"
                step="0.01"
                name="monthlyFee"
                value={value}
                disabled={isSubmitting}
                onChange={(event) => setValue(event.target.value)}
                onBlur={(event) => submitIfNeeded(event.currentTarget.form)}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        onClose();
                    }

                    if (event.key === 'Enter') {
                        event.preventDefault();
                        submitIfNeeded(event.currentTarget.form);
                    }
                }}
                className="text-right"
            />
        </form>
    );
}
