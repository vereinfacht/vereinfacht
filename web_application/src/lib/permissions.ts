import type { Session } from 'next-auth';

/**
 * Mock permission check - temporarily allows all authenticated users access
 * This will be replaced when Laravel API provides real user permissions
 */
export function mockHasPermission(
    session: Session | null,
    _action: string,
    _resource: string,
): boolean {
    // For now, assume all authenticated users have all permissions
    // This will be replaced when Laravel API provides real permissions
    return !!session?.accessToken;
}
