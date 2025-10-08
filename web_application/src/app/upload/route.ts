import { createMediaSchema } from '@/actions/media/create.schema';
import { createAuthenticatedAction, handleApiResponse } from '@/lib/api/utils';
import { NextRequest, NextResponse } from 'next/server';
import { BaseBody, parseRelationship } from '@/actions/base/create';
import { redirect } from 'next/navigation';
import { auth } from '@/utils/auth';
import { baseDeleteSchema } from '@/actions/base/delete.schema';

export const DELETE = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const { id } = await req.json();

    console.log({ id });

    const action = createAuthenticatedAction(
        'delete',
        'media',
        baseDeleteSchema,
        async (params, client) => {
            const response = await client.DELETE('/media/{media_id}', {
                params: {
                    path: { media_id: params.id },
                },
            });

            if (response.error) {
                handleApiResponse(response, 'Failed to delete media');
            }

            return true;
        },
    );

    const response = await action({ id });

    console.log(response);

    return NextResponse.json({ status: 200 });
};

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const formData = await req.formData();
    const body: BaseBody = { data: { type: 'media' } };
    const relationships = body.data.relationships || {};

    relationships.club = {
        data: { type: 'clubs', id: session.club_id.toString() },
    };

    body.data.relationships = relationships;

    const attributes: Record<string, any> = {};

    for (const [key, raw] of Array.from(formData.entries())) {
        if (key.startsWith('relationships[')) {
            const relationship = await parseRelationship(key, raw);

            if (!relationship) {
                continue;
            }

            Object.assign(relationships, relationship);
        } else {
            attributes[key] = raw === '' ? undefined : raw;
        }
    }

    body.data.attributes = attributes;
    body.data.relationships = relationships;

    const action = createAuthenticatedAction(
        'create',
        'media',
        createMediaSchema,
        async (body, client) => {
            const response = await client.POST('/media', {
                body,
            });

            return handleApiResponse(response, 'Failed to create media');
        },
    );

    const response = await action(body);

    return NextResponse.json({ status: 201, mediaId: response.data.id });
};
