import { auth } from '@/utils/auth';
import LoginForm from './components/login-form';
import { signOut } from 'next-auth/react';

export default async function LoginPage() {
    const session = await auth();

    // For now we use the login page to force nextjs session invalidation
    // for when the api token is invalid. See admin-api.ts:handleError
    if (session) {
        signOut();
    }

    return <LoginForm />;
}
