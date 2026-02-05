import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const tableExportSchema = z.object({
    ids: z.array(z.string()),
    resourceName: z.string(),
});

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const formData = await req.formData();

    const ids = formData.getAll('ids[]') as string[];
    const resourceName = formData.get('resourceName') as string;

    const result = tableExportSchema.safeParse({
        ids,
        resourceName,
    });

    if (!result.success) {
        return NextResponse.json({
            status: 400,
            message: 'Invalid form data',
            details: result.error.issues,
        });
    }

    const apiFormData = new FormData();
    ids.forEach((id) => {
        apiFormData.append('ids[]', id);
    });
    apiFormData.append('resourceName', resourceName);

    const response = await fetch(
        `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/export/table`,
        {
            method: 'POST',
            body: apiFormData,
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                Accept: 'application/vnd.api+json',
            },
        },
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        return NextResponse.json(
            {
                status: response.status,
                message: 'Failed to export table data',
                error: errorText,
            },
            { status: response.status },
        );
    }

    const body = response.body;

    return new Response(body, {
        status: 200,
        headers: {
            'content-type':
                response.headers.get('content-type') ||
                'application/octet-stream',
            'content-disposition':
                response.headers.get('content-disposition') || '',
        },
    });
};
