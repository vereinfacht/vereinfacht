import { User } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
import { ApiEndpoints } from './api-endpoints';

export class AdminApi extends ApiEndpoints {
    constructor(bearerToken?: string) {
        super(bearerToken);
    }

    protected async handleError(response: Response) {
        if (response.status === 401 || response.status === 403) {
            return redirect('/login');
        }

        if (response.status === 404) {
            return notFound();
        }

        return await super.handleError(response);
    }

    async login(data: { email?: string; password?: string }) {
        return await this.post<User>('users/login', data, {
            Authorization: '', // explicitly do not use any token for login requests
        });
    }

    async logout() {
        return await this.post<User>('users/logout', {});
    }
}
