import { JsonApiUser } from '@/types/jsonapi-models';
import { JWT, Session, User } from 'next-auth/next';

declare module 'next-auth' {
    // describes nextjs session object returned to client
    interface JWT extends Session {}

    // describes api login response
    interface User extends JsonApiUser {
        meta: { token: string; club_id: string };
    }

    interface Session {
        accessToken: string;
        user: JsonApiUser['data'];
        club_id: string | number; // in existing production sessions, this id is a number. in the future this should always be a string (see: /src/utils/auth.ts)
    }
}
