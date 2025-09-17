import { createServerClient } from '@/lib/api/server-client';
import { mockHasPermission } from '@/lib/permissions';
import { auth } from '@/utils/auth';
import { prepareQuery } from '@/utils/query-params';
import createTranslation from 'next-translate/createTranslation';
import { notFound, redirect } from 'next/navigation';
import { z } from 'zod';

// Types for permission actions and resources
type PermissionAction = 'view' | 'create' | 'update' | 'delete';
type PermissionResource = string;

// Generic API response type
interface ApiResponse<T = unknown> {
    data?: T;
    error?: unknown;
    response?: {
        status: number;
    };
}

/**
 * Creates an authenticated server client after checking session
 */
export async function createAuthenticatedClient() {
    const session = await auth();

    if (!session?.accessToken) {
        redirect('/admin/auth/login');
    }

    return {
        client: createServerClient(session.accessToken),
        session,
    };
}

/**
 * Handles API response errors consistently with enhanced error information
 */
export function handleApiResponse<T>(
    response: ApiResponse<T>,
    errorMessage: string,
): T {
    if (response.error) {
        console.error('API Error:', response.error);

        // Handle specific HTTP status codes
        if (response.response?.status === 404) {
            notFound();
        }

        if (response.response?.status === 403) {
            const error = new Error(
                'You do not have permission to perform this action',
            ) as Error & { digest?: string };
            error.digest = crypto.randomUUID();
            throw error;
        }

        if (response.response?.status && response.response.status >= 500) {
            const error = new Error(
                'Server error - please try again later',
            ) as Error & { digest?: string };
            error.digest = crypto.randomUUID();
            throw error;
        }

        // Create descriptive error with digest for tracking
        const error = new Error(errorMessage) as Error & { digest?: string };
        error.digest = crypto.randomUUID();

        // Add response details to error message for debugging
        if (process.env.NODE_ENV === 'development') {
            error.message += ` (${JSON.stringify(response.error)})`;
        }

        throw error;
    }

    return response.data as T;
}

/**
 * Generic wrapper for authenticated server actions with permission checking
 */
export function createAuthenticatedAction<TInput, TOutput>(
    action: PermissionAction,
    resource: PermissionResource,
    schema: z.ZodType<TInput>,
    handler: (
        params: TInput,
        client: ReturnType<typeof createServerClient>,
    ) => Promise<TOutput>,
) {
    return async (params: TInput): Promise<TOutput> => {
        // Validate input
        const validatedParams = schema.parse(params);

        // Get authenticated client and session
        const { client, session } = await createAuthenticatedClient();

        // Check permissions
        if (!mockHasPermission(session, action, resource)) {
            throw new Error(
                `Insufficient permissions to ${action} ${resource}`,
            );
        }

        try {
            return await handler(validatedParams, client);
        } catch (error) {
            console.error(`Error ${action}ing ${resource}:`, error);

            throw new Error(createTranslation().t('error:unknown'));
        }
    };
}

/**
 * Wrapper for actions with optional parameters (like list actions)
 */
export function createAuthenticatedActionWithOptionalParams<TInput, TOutput>(
    action: PermissionAction,
    resource: PermissionResource,
    schema: z.ZodType<TInput>,
    handler: (
        query: Record<string, string | number | string[]>,
        client: ReturnType<typeof createServerClient>,
    ) => Promise<TOutput>,
) {
    return async (params: TInput = {} as TInput): Promise<TOutput> => {
        // Validate input
        const validatedParams = schema.parse(params);

        // Get authenticated client and session
        const { client, session } = await createAuthenticatedClient();

        // Check permissions
        if (!mockHasPermission(session, action, resource)) {
            throw new Error(
                `Insufficient permissions to ${action} ${resource}`,
            );
        }

        // Prepare query
        const preparedQuery = prepareQuery(validatedParams);

        try {
            return await handler(preparedQuery, client);
        } catch (error) {
            console.error(`Error ${action}ing ${resource}:`, error);

            throw new Error(createTranslation().t('error:unknown'));
        }
    };
}

/**
 * Simplified wrapper for actions that don't need complex error handling
 */
export function createSimpleAuthenticatedAction<TOutput>(
    action: PermissionAction,
    resource: PermissionResource,
    handler: (
        client: ReturnType<typeof createServerClient>,
    ) => Promise<TOutput>,
) {
    return async (): Promise<TOutput> => {
        // Get authenticated client and session
        const { client, session } = await createAuthenticatedClient();

        // Check permissions
        if (!mockHasPermission(session, action, resource)) {
            throw new Error(
                `Insufficient permissions to ${action} ${resource}`,
            );
        }

        try {
            return await handler(client);
        } catch (error) {
            console.error(`Error ${action}ing ${resource}:`, error);

            throw new Error(createTranslation().t('error:unknown'));
        }
    };
}
