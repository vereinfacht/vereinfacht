'use client';

import { hexToCssString, shouldUseDarkMode } from '@/utils/colors';
import useTranslation from 'next-translate/useTranslation';
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

export default function Examples() {
    const [color, setColor] = useState<string | undefined>();
    const { t } = useTranslation();
    const [sections, setSections] = useState<Record<string, any>[]>([]);
    const btnClass = 'flex flex-row items-center gap-4';

    return (
        <>
            <MultipleSections
                sections={sections}
                addText={t('application:add_person')}
                addSection={() => setSections([...sections, {}])}
                renderSection={(index) => (
                    <FormIntro
                        headline={t('application:headline_person', {
                            count: index + 1,
                        })}
                        icon={<IconPerson className="fill-current" />}
                        text={t('application:intro_owner')}
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
                renderSection={() => (
                    <MultiselectInput
                        id="multiselect"
                        label={
                            <InputLabel
                                forInput="multiselect"
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

            <MultipleSections
                sections={sections}
                renderSection={() => (
                    <MultiselectInput
                        id="multiselect"
                        label={
                            <InputLabel
                                forInput="multiselect"
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
                            size={'small'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="primary"
                            size={'iconDefault'}
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
                            size={'small'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="secondary"
                            size={'iconDefault'}
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
                            size={'small'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiary"
                            size={'iconDefault'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    {/* tertiaryGrey */}
                    <div className={btnClass}>
                        <Button
                            variant="tertiaryGrey"
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryGrey"
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryGrey"
                            size={'small'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryGrey"
                            size={'iconDefault'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    {/* tertiaryDanger */}
                    <div className={btnClass}>
                        <Button
                            variant="tertiaryDanger"
                            size={'default'}
                            disabled={true}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryDanger"
                            size={'default'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryDanger"
                            size={'small'}
                            leftIcon={<IconEmpty />}
                            rightIcon={<IconEmpty />}
                        >
                            Button
                        </Button>
                        <Button
                            variant="tertiaryDanger"
                            size={'iconDefault'}
                            rightIcon={<IconEmpty />}
                        ></Button>
                    </div>
                    <div className={btnClass}>
                        <Button variant="primary" size={'circularSmall'}>
                            1
                        </Button>
                        <Button variant="primary" size={'circularSmall'}>
                            22
                        </Button>
                        <Button variant="primary" size={'circularSmall'}>
                            333
                        </Button>
                        <Button variant="primary" size={'circularSmall'}>
                            4444
                        </Button>
                    </div>
                    <div className={btnClass}>
                        <Button variant="primary" size={'circularDefault'}>
                            1
                        </Button>
                        <Button variant="primary" size={'circularDefault'}>
                            22
                        </Button>
                        <Button variant="primary" size={'circularDefault'}>
                            333
                        </Button>
                        <Button variant="primary" size={'circularDefault'}>
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
            </div>
        </>
    );
}
