import { NextRequest } from 'next/server';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const response = await fetch(
        `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/media/${id}/download`,
        {
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
            },
        },
    );

    if (!response.ok) {
        return new Response('Unauthorized', { status: response.status });
    }

    return new Response(response.body, {
        headers: {
            'Content-Type':
                response.headers.get('Content-Type') ??
                'application/octet-stream',
            'Cache-Control': 'private, no-store',
        },
    });
}
