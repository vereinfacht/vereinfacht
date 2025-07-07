import 'server-only';
import { ApiEndpoints } from './api-endpoints';

class ClubApi extends ApiEndpoints {
    constructor() {
        super(process.env.API_BEARER_TOKEN ?? '');
    }

    async findClubBySlug<T>(slug: string): Promise<T> {
        return await this.get(
            `clubs?filter[slug]=${slug}&include=divisions,membershipTypes.divisionMembershipTypes.division,paymentPeriods`,
            ['clubs'],
        );
    }

    async applyMembership<T>(data: { id: string }) {
        const serializedData = this.serialize('memberships', data);
        return await this.post<T>(
            `memberships/${data.id}/-actions/apply`,
            serializedData,
        );
    }
}

export const clubApi = new ClubApi();
