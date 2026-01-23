'use client';

import { capitalizeFirstLetter } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import React, { ReactNode } from 'react';
import Button from '../Button/Button';
import Section from './Section';
import IconPlus from '/public/svg/plus.svg';

interface Props {
    sections: any[];
    renderSection: (index: number) => ReactNode;
    addSection?: () => void;
    addText?: string;
}

export default function MultipleSections({
    addText,
    sections,
    addSection,
    renderSection,
}: Props) {
    const { t } = useTranslation();
    const hasMiddleSection = typeof addSection === 'function';

    return (
        <div>
            <ul>
                {sections.map((item, index) => (
                    <Section
                        key={index}
                        index={index}
                        hasMiddleSection={hasMiddleSection}
                    >
                        {renderSection(index)}
                    </Section>
                ))}
            </ul>
            {hasMiddleSection ? (
                <div className="relative z-10 overflow-hidden rounded-t-3xl bg-blue-300">
                    <div className="px-6 pt-4 pb-10">
                        <Button
                            icon={<IconPlus />}
                            className="mx-auto"
                            onClick={addSection}
                        >
                            {capitalizeFirstLetter(addText ?? t('general:add'))}
                        </Button>
                    </div>
                    <div className="shadow-negative h-6 w-full rounded-t-3xl bg-white"></div>
                </div>
            ) : (
                <div className="relative z-10 rounded-t-3xl bg-blue-300">
                    <div className="h-6 w-full rounded-t-3xl bg-white"></div>
                </div>
            )}
        </div>
    );
}
