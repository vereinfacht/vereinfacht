import HelpText from '@/app/components/HelpText';
import Text from '@/app/components/Text/Text';
import { DefaultDetailFieldDef, ResourceName } from '@/resources/resource';
import { camelCaseToSnakeCase, singularize } from '@/utils/strings';
import useTranslation from 'next-translate/useTranslation';
import BooleanField from './Detail/BooleanField';
import ColorField from './Detail/ColorField';
import CurrencyField from './Detail/CurrencyField';
import DateField from './Detail/DateField';
import DefaultField from './Detail/DefaultField';
import HtmlField from './Detail/HtmlField';
import ImageField from './Detail/ImageField';
import { LinkField } from './Detail/LinkField';
import MediaField from './Detail/MediaField';
import TranslationField from './Detail/TranslationField';

type Props<T> = DefaultDetailFieldDef<T> & {
    value: any;
    resourceName: ResourceName;
    id?: string;
};

export default function DetailField<T>({
    attribute,
    resourceName,
    label,
    help,
    value,
    id = undefined,
    formatValue,
    ...props
}: Props<T>) {
    const { t } = useTranslation();
    const translationNamespace = camelCaseToSnakeCase(
        singularize(resourceName),
    );
    const type = 'type' in props ? props.type : 'default';
    const displayValue = formatValue ? formatValue(value) : value;
    const translationKey = camelCaseToSnakeCase(attribute.toString());
    const helpText =
        help != null
            ? help
            : t(
                  `${translationNamespace}:${translationKey}.help`,
                  {},
                  { fallback: '' },
              );
    let component;

    switch (type) {
        case 'image':
            component = <ImageField value={displayValue} />;
            break;
        case 'link':
            component = <LinkField value={displayValue} />;
            break;
        case 'color':
            component = <ColorField value={displayValue} />;
            break;
        case 'date':
            component = <DateField value={displayValue} />;
            break;
        case 'translation':
            component = <TranslationField value={displayValue} />;
            break;
        case 'currency':
            component = <CurrencyField value={displayValue} />;
            break;
        case 'boolean':
            component = <BooleanField value={displayValue} />;
            break;
        case 'media':
            component = <MediaField value={displayValue} />;
            break;
        case 'html':
            component = <HtmlField value={displayValue} />;
            break;

        default:
            component = <DefaultField value={displayValue} />;
            break;
    }

    return (
        <li
            className="rounded-lg border border-transparent px-3 py-2 md:flex md:flex-row md:gap-6"
            style={{
                backgroundImage:
                    'linear-gradient(white, white), linear-gradient(#F7F9FA, #EBF1F4)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
            }}
            {...(id !== undefined ? { id: `${id}` } : {})}
        >
            <div className="shrink pt-0.5 md:w-64">
                <Text preset="label" className="md:hyphens-auto">
                    {t(
                        label ??
                            `${translationNamespace}:${translationKey}.label`,
                    )}
                </Text>
                {helpText != '' && <HelpText text={helpText} />}
            </div>
            <div className="flex-1">{component}</div>
        </li>
    );
}
