import { NextRequest } from 'next/server';
import { auth } from '@/utils/auth';
import { redirect } from 'next/dist/client/components/navigation';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } },
) {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const response = await fetch(
        `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/media/${params.id}/preview`,
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
                response.headers.get('Content-Type') ?? 'image/jpeg',
            'Cache-Control': 'private, no-store',
        },
    });
}
