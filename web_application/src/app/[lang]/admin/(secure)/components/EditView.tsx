import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import useTranslation from 'next-translate/useTranslation';
import TranslationField from './Fields/Form/TranslationField';
import EditForm from './Form/EditForm';
import { getEditFields } from './Form/utils';
import { ResourceName } from '@/resources/resource';
import { ResourceModel } from '@/types/models';
import MessageBox from '@/app/components/MessageBox';
import { ZodObject } from 'zod';
import { UpdateAction } from '@/actions/validateForm';
import Checkbox from '@/app/components/Input/Checkbox';

interface Props {
    hint?: string;
    resource: ResourceModel;
    resourceName: ResourceName;
    updateSchema: ZodObject<any>;
    updateAction: UpdateAction;
}

export default function EditView({
    resource,
    resourceName,
    updateAction,
    updateSchema,
    hint,
}: Props) {
    const { t } = useTranslation();
    const fields = getEditFields(updateSchema, resourceName, resource, t);

    return (
        <div className="container">
            {hint && (
                <MessageBox
                    className="mb-10 mb-4"
                    preset="hint"
                    message={t(hint)}
                />
            )}
            <EditForm
                id={resource.id}
                action={updateAction}
                resourceName={resourceName}
                fields={fields.map((field) => {
                    if (field.type === 'translation') {
                        return <TranslationField key={field.id} {...field} />;
                    }

                    if (field.type === 'select') {
                        return <SelectInput key={field.id} {...field} />;
                    }

                    if (field.type === 'checkbox') {
                        return <Checkbox key={field.id} {...field} />;
                    }

                    return <TextInput key={field.id} {...field} />;
                })}
            />
        </div>
    );
}
