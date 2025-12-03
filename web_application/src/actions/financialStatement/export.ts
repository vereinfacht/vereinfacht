'use server';

import { ExportFormActionState } from '@/app/[lang]/admin/(secure)/finances/receipts/_components/financial-statement-export-module';
import { auth } from '@/utils/auth';
import { redirect } from 'next/navigation';
import { ZodError } from 'zod';
import { exportFinancialStatementSchema } from './export.schema';

export async function exportFinancialStatementFormAction(
    previousState: ExportFormActionState,
    formData: FormData,
): Promise<ExportFormActionState> {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    try {
        const formEntries = Object.fromEntries(formData.entries());
        const includeMedia = formEntries.includeMedia === 'true';

        const validatedData = exportFinancialStatementSchema.parse({
            data: {
                type: 'financial-statements',
                attributes: {
                    receipts: formEntries.receipts,
                    includeMedia,
                },
            },
        });

        const requestBody = {
            receipts: validatedData.data.attributes.receipts,
            includeMedia: validatedData.data.attributes.includeMedia,
        };

        const response = await fetch(
            `${(process.env.API_DOMAIN || '') + (process.env.API_PATH || '')}/export/financial-statement`,
            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            },
        );

        if (!response.ok) {
            const text = await response.text();
            let errorData;

            try {
                errorData = JSON.parse(text);
            } catch {
                errorData = { message: text };
            }

            return {
                success: false,
                errors: errorData.errors || {},
            };
        }

        const contentType = response.headers.get('content-type');
        // Content-Type: text/csv; charset=UTF-8
        console.log('Content-Type:', contentType);
        return new Response(response.body, {
            headers: {
                ...response.headers,
                'content-type': 'text/csv; charset=UTF-8',
                'content-disposition': `attachment; filename="downloaded_file.csv"`,
            },
        });
        // if (contentType?.includes('application/json')) {
        //     return {
        //         success: true,
        //         message: 'Financial statement exported successfully',
        //     };
        // } else {
        //     const csvContent = await response.text();

        //     return {
        //         success: true,
        //         message: 'Financial statement exported successfully',
        //         downloadContent: csvContent,
        //     };
        // }
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
            };
        }

        return {
            success: false,
            errors: { general: ['An unexpected error occurred.'] },
        };
    }
}
