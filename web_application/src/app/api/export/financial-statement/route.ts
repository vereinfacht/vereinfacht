import { exportFinancialStatementSchema } from '@/actions/financialStatement/export.schema';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export const POST = async (req: NextRequest) => {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    const formData = await req.formData();
    const result = exportFinancialStatementSchema.safeParse(
        Object.fromEntries(formData.entries()),
    );

    if (!result.success) {
        return NextResponse.json({
            status: 400,
            message: 'Invalid form data',
            details: result.error.issues,
        });
    }

    // using openapi-fetch lead to issues with parsing the multipart form data correctly
    // so we are using fetch() directly here
    const response = await fetch(
        `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/export/financial-statement`,
        {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${session.accessToken}`,
                Accept: 'application/vnd.api+json',
            },
        },
    );

    if (!response.ok) {
        return NextResponse.json({
            status: response.status,
            message: 'Failed to export financial statement',
        });
    }

    const body = response.body;

    return new Response(body, {
        status: 200,
        headers: {
            content: response.headers.get('content-type') || '',
            disposition: response.headers.get('content-disposition') || '',
        },
    });
};
