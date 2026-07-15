'use server';

import { AdminApi } from '@/services/admin-api';

const adminApi = new AdminApi();

export async function requestPasswordReset(email: string, lang: string) {
    adminApi.setLocale(lang);

    if (!email) {
        return { success: false, message: 'Email is required.' };
    }

    try {
        const response = (await adminApi.forgotPassword({ email })) as {
            message?: string;
        };

        return {
            success: true,
            message: response.message,
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message,
        };
    }
}
