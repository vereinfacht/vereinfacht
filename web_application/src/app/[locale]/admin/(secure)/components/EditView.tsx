import { useTranslations } from 'next-intl';
import SelectInput from '@/app/components/Input/SelectInput';
import TextInput from '@/app/components/Input/TextInput';
import TranslationField from './Fields/Form/TranslationField';
import EditForm from './Form/EditForm';
import { getEditFields } from './Form/utils';
import { ResourceName } from '@/resources/resource';
import { ResourceModel } from '@/types/models';
import MessageBox from '@/app/components/MessageBox';
import { ZodObject } from 'zod';
import type { UpdateAction } from '@/types/form-actions';
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
    const t = useTranslations();
    const fields = getEditFields(updateSchema, resourceName, resource, t);

    return (
        <div className="col-span-2 container">
            {hint && (
                <MessageBox
                    className="mb-4 mb-10"
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
