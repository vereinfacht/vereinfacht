'use client';

import { deserialize, DocumentObject } from 'jsonapi-fractal';
import { useEffect, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { listDivisions } from '@/actions/divisions/list';
import { itemsPerQuery } from '@/app/components/Input/BelongsToSelectInput';
import { Option } from '@/app/components/Input/SelectInput';
import Text from '@/app/components/Text/Text';
import { TDivisionDeserialized } from '@/types/resources';
import IconPlus from '/public/svg/plus_new.svg';
import { DivisionField } from './division-field';

type DivisionRow = {
    id: string;
    selectedDivision: Option | null;
};

interface Props {
    memberId: string;
}

export default function DivisionFields({ memberId }: Props) {
    const { t } = useTranslation();

    const nextRowIdRef = useRef(1);

    const [rows, setRows] = useState<DivisionRow[]>([
        {
            id: 'division-row-0',
            selectedDivision: null,
        },
    ]);

    const [divisionOptions, setDivisionOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchDivisions = async () => {
            try {
                const response = await listDivisions({
                    page: {
                        size: itemsPerQuery,
                        number: 1,
                    },
                    filter: {
                        query: '',
                    },
                });

                const divisions = deserialize(
                    response as DocumentObject,
                ) as TDivisionDeserialized[];

                if (cancelled) {
                    return;
                }

                setDivisionOptions(
                    divisions.map((division) => ({
                        value: division.id,
                        label: division.title as string,
                    })),
                );
            } catch (error) {
                console.error('Error fetching divisions:', error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchDivisions();

        return () => {
            cancelled = true;
        };
    }, []);

    const addDivision = () => {
        setRows((previous) => {
            if (loading || previous.length >= divisionOptions.length) {
                return previous;
            }

            return [
                ...previous,
                {
                    id: `division-row-${nextRowIdRef.current++}`,
                    selectedDivision: null,
                },
            ];
        });
    };

    const removeDivision = (rowId: string) => {
        setRows((previous) => previous.filter((row) => row.id !== rowId));
    };

    const updateDivision = (rowId: string, selectedDivision: Option | null) => {
        setRows((previous) =>
            previous.map((row) =>
                row.id === rowId
                    ? {
                          ...row,
                          selectedDivision,
                      }
                    : row,
            ),
        );
    };

    const getAvailableOptions = (currentRow: DivisionRow) =>
        divisionOptions.filter((option) => {
            const isCurrent =
                String(currentRow.selectedDivision?.value) ===
                String(option.value);

            const selectedInAnotherRow = rows.some(
                (row) =>
                    row.id !== currentRow.id &&
                    String(row.selectedDivision?.value) ===
                        String(option.value),
            );

            return isCurrent || !selectedInAnotherRow;
        });

    const canAddDivision =
        !loading &&
        divisionOptions.length > 0 &&
        rows.length < divisionOptions.length;

    return (
        <div className="flex flex-col gap-4">
            {rows.map((row) => (
                <DivisionField
                    key={row.id}
                    resourceName={`member_${memberId}_division_${row.id}`}
                    label={t('division:title.one')}
                    options={getAvailableOptions(row)}
                    loading={loading}
                    selectedDivision={row.selectedDivision}
                    onChange={(division) => updateDivision(row.id, division)}
                    onRemove={() => removeDivision(row.id)}
                />
            ))}

            {canAddDivision && (
                <button
                    type="button"
                    onClick={addDivision}
                    className="text-textLink hover:text-textHover flex cursor-pointer items-center gap-2 px-2 py-2 text-sm font-medium"
                >
                    <IconPlus />

                    <Text className="leading-[1em]">
                        {t('member:add_division')}
                    </Text>
                </button>
            )}
        </div>
    );
}
