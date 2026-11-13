'use client';
import { useTranslations } from 'next-intl';

import { hexToCssString, shouldUseDarkMode } from '@/utils/colors';
import { useState } from 'react';
import FormIntro from './FormIntro';
import InputLabel from './Input/InputLabel';
import SelectInput from './Input/SelectInput';
import TextAreaInput from './Input/TextAreaInput';
import TextInput from './Input/TextInput';
import MadeWith from './MadeWith';
import MultipleSections from './MultipleSections/MultipleSections';
import MultiselectInput from './MultiselectInput/MultiselectInput';
import Text from './Text/Text';
import IconPerson from '/public/svg/person.svg';
import IconTrash from '/public/svg/trash.svg';
import IconEmpty from '/public/svg/empty.svg';
import { Button } from '@/app/components/ui/button';
import { User } from 'lucide-react';

import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxList,
    ComboboxItem,
    useComboboxAnchor,
} from '@/app/components/ui/combobox';

const sportsOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'fitness', label: 'Fitness-Studio' },
    { value: 'fussball', label: 'Fußball' },
    { value: 'golf', label: 'Golf' },
    { value: 'handball', label: 'Handball' },
    { value: 'tennis', label: 'Tennis' },
];

export default function Examples() {
    const [color, setColor] = useState<string | undefined>();
    const t = useTranslations();
    const [sections, setSections] = useState<Record<string, any>[]>([]);
    const btnClass = 'flex flex-row items-center gap-4';

    const [value, setValue] = useState<(typeof sportsOptions)[number] | null>(
        null,
    );
    const anchor = useComboboxAnchor();

    return (
        <>
            <MultipleSections
                sections={sections}
                addText={t('application.add_person')}
                addSection={() => setSections([...sections, {}])}
                renderSection={(index) => (
                    <FormIntro
                        headline={t('application.headline_person', {
                            count: index + 1,
                        })}
                        icon={<IconPerson className="fill-current" />}
                        text={t('application.intro_owner')}
                        rightComponent={
                            <IconTrash
                                className="h-12 w-12 cursor-pointer stroke-red-500 stroke-2 [stroke-linecap:round] [stroke-linejoin:round]"
                                onClick={() => {
                                    const newSections = [...sections];
                                    newSections.splice(index, 1);
                                    setSections(newSections);
                                }}
                            />
                        }
                    />
                )}
            />

            <MultipleSections
                sections={sections}
                renderSection={(index) => (
                    <MultiselectInput
                        name={`multiselect.${index}`}
                        label={
                            <InputLabel
                                forInput={`multiselect.${index}`}
                                className="flex items-end"
                            >
                                <IconPerson className="mr-1 -mb-0.5 scale-75 fill-current" />
                                MultiselectInput
                            </InputLabel>
                        }
                        options={[
                            { value: 1, label: 'Wade Cooper' },
                            { value: 2, label: 'Arlene Mccoy' },
                            { value: 3, label: 'Devon Webb' },
                            { value: 4, label: 'Tom Cook' },
                            { value: 5, label: 'Tanya Fox' },
                            { value: 6, label: 'Hellen Schmidt' },
                        ]}
                    />
                )}
            />

            <div className="flex flex-col items-start gap-6 px-8">
                <TextAreaInput
                    id="textarea"
                    label="TextAreaInput"
                    placeholder="Placeholder"
                    rows={3}
                    onChange={(e) => console.log(e.target.value)}
                />
                <TextInput
                    id="color-input"
                    label="Primary color"
                    type="color"
                    onChange={(event) => {
                        setColor(event.target.value);

                        if (color) {
                            const darkMode = shouldUseDarkMode(color);
                            const rootElement = document.querySelector(':root');

                            // @ts-expect-error: custom properties are not typed
                            rootElement?.style.setProperty(
                                '--color-primary-500',
                                hexToCssString(color),
                            );

                            if (darkMode) {
                                rootElement?.classList.add('dark-primary');
                            } else {
                                rootElement?.classList.remove('dark-primary');
                            }
                        }
                    }}
                />
                <Text>Lorem ipsum</Text>
                <Text preset="body-sm">Lorem ipsum body-sm</Text>
                <Text preset="label">Lorem ipsum label</Text>
                <Text preset="display">Lorem ipsum display</Text>
                <Text preset="headline">Lorem ipsum headline</Text>
                <div className="flex flex-col gap-6">
                    {/* primary*/}
                    <div className={btnClass}>
                        <Button
                            variant="primary"
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="primary"
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="primary"
                            size={'sm'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="primary"
                            size={'icon'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    {/* secondary*/}
                    <div className={btnClass}>
                        <Button
                            variant="secondary"
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="secondary"
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="secondary"
                            size={'sm'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="secondary"
                            size={'icon'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    {/* tertiary */}
                    <div className={btnClass}>
                        <Button
                            variant="tertiary"
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiary"
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiary"
                            size={'sm'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiary"
                            size={'icon'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    {/* tertiaryGray */}
                    <div className={btnClass}>
                        <Button
                            variant="tertiaryGray"
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryGray"
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryGray"
                            size={'sm'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryGray"
                            size={'icon'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    {/* tertiary, danger = true */}
                    <div className={btnClass}>
                        <Button
                            danger={true}
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            danger={true}
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            danger={true}
                            size={'sm'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            danger={true}
                            size={'icon'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    <div className={btnClass}>
                        <Button variant="primary" size={'circularSm'}>
                            1
                        </Button>
                        <Button variant="primary" size={'circularSm'}>
                            22
                        </Button>
                        <Button variant="primary" size={'circularSm'}>
                            333
                        </Button>
                        <Button variant="primary" size={'circularSm'}>
                            4444
                        </Button>
                    </div>
                    <div className={btnClass}>
                        <Button variant="primary" size={'circular'}>
                            1
                        </Button>
                        <Button variant="primary" size={'circular'}>
                            22
                        </Button>
                        <Button variant="primary" size={'circular'}>
                            333
                        </Button>
                        <Button variant="primary" size={'circular'}>
                            4444
                        </Button>
                    </div>
                </div>

                <TextInput
                    id="text-input"
                    label="TextInput"
                    placeholder="Placeholder"
                    onChange={(e) => console.log(e.target.value)}
                />
                <TextInput
                    id="date-input"
                    label={'TextInput type="date"'}
                    type="date"
                    onChange={(e) => console.log(e.target.value)}
                />
                <SelectInput
                    id="select-input"
                    name="select-input"
                    label="SelectInput"
                    required
                    options={[
                        {
                            value: 1,
                            label: 'Option 1',
                        },
                        {
                            value: 2,
                            label: 'Option 2',
                        },
                    ]}
                />
                <MadeWith />
                <div className="w-full max-w-lg space-y-1.5 p-4">
                    <label
                        htmlFor="sports-combobox"
                        className="text-textPrimary flex items-center gap-2 text-sm font-bold"
                    >
                        <User className="size-4 stroke-[2.5]" />
                        <span>Ursa Gentry</span>
                    </label>

                    <Combobox
                        items={sportsOptions}
                        value={value}
                        onValueChange={setValue}
                        itemToStringLabel={(option) => option.label}
                    >
                        <div ref={anchor} className="w-full">
                            <ComboboxInput
                                id="sports-combobox"
                                placeholder="Suchen und hinzufügen"
                            />
                        </div>

                        <ComboboxContent
                            anchor={anchor}
                            className="group/combobox-content"
                        >
                            <ComboboxEmpty>Keine Ergebnisse</ComboboxEmpty>
                            <ComboboxList>
                                {(option: (typeof sportsOptions)[number]) => (
                                    <ComboboxItem
                                        key={option.value}
                                        value={option}
                                    >
                                        {option.label}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>
            </div>
        </>
    );
}
