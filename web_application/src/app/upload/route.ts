import { uploadSchema } from '@/actions/media/upload.schema';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { File } from 'node:buffer';

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const formData = await req.formData();
    formData.append('clubId', session.club_id.toString());
    const result = uploadSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!result.success) {
        return NextResponse.json({
            status: 400,
            message: 'Invalid form data',
            details: result.error.issues,
        });
    }

    const file = formData.get('file') as File | null;

    if (!file) {
        return NextResponse.json({ status: 400, message: 'No file provided' });
    }

    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    const forwardData = new FormData();
    forwardData.append('file', blob, file.name);
    forwardData.append(
        'collectionName',
        formData.get('collectionName') as string,
    );
    forwardData.append('clubId', session.club_id.toString());

    // using openapi-fetch lead to issues with parsing the multipart form data correctly
    // so we are using fetch() directly here
    const response = await fetch(
        `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/media/upload`,
        {
            method: 'POST',
            body: forwardData,
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                Accept: 'application/vnd.api+json',
            },
        },
    );

    const text = await response.text();
    const responseData = JSON.parse(text);

    if (response.status !== 201) {
        return NextResponse.json({
            status: response.status,
            message: 'Failed to create media',
            details: responseData,
        });
    }

    return NextResponse.json({ status: 201, mediaId: responseData.data.id });
};
