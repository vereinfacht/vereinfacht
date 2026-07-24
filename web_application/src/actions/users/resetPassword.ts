'use server';

import { AdminApi } from '@/services/admin-api';

export async function resetPassword(
    data: {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
    },
    lang: string,
) {
    const adminApi = new AdminApi();
    adminApi.setLocale(lang);

    try {
        const response = (await adminApi.resetPassword(data)) as {
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
