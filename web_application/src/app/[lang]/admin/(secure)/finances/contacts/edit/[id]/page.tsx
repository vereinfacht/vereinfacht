'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { contacts } from '../../page';

type ContactPageProps = {
    params: { id: string };
};

export default function EditContactPage({ params }: ContactPageProps) {
    const contact = contacts.find((contact) => contact.id === params.id);

    if (!contact) {
        return notFound();
    }

    const router = useRouter();

    const [formData, setFormData] = useState(contact);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        console.log('Updated contact:', formData);

        router.push(`/admin/finance/contacts`);
    };

    function onChangeHandler(
        event: ChangeEvent<HTMLInputElement>,
        field: keyof typeof formData,
    ) {
        setFormData({
            ...formData,
            [field]: event.target.value,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
                <label className="block font-semibold">First Name</label>
                <input
                    className="w-full rounded border p-2"
                    value={formData.firstName}
                    onChange={(event) => onChangeHandler(event, 'firstName')}
                />
            </div>

            <div>
                <label className="block font-semibold">Last Name</label>
                <input
                    className="w-full rounded border p-2"
                    value={formData.lastName}
                    onChange={(event) => onChangeHandler(event, 'lastName')}
                />
            </div>

            <div>
                <label className="block font-semibold">Street</label>
                <input
                    className="w-full rounded border p-2"
                    value={formData.street}
                    onChange={(event) => onChangeHandler(event, 'street')}
                />
            </div>
            <button
                type="submit"
                className="mt-4 rounded bg-blue-500 px-14 py-2 text-white"
            >
                Save
            </button>
        </form>
    );
}
