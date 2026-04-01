import { FormMember } from '@/hooks/application/ApplicationProvider';
import { ResourceName } from '@/resources/resource';
import {
    JsonApiClub,
    JsonApiDivision,
    JsonApiMember,
    JsonApiMembership,
} from '@/types/jsonapi-models';
import { Division, Membership } from '@/types/models';
import { camelCaseToKebabCase } from '@/utils/strings';
import { JsonApi } from './json-api';

type FilterValue = string | number;

export const itemsPerPage = 10;
export interface Query {
    include?: string[];
    sort?: string;
    fields?: { [key: string]: string[] };
    filter?: { [key: string]: FilterValue | FilterValue[] };
    page?: number;
}

export interface UpdateData extends Record<string, any> {
    id: string;
}

function addQueryParams(path: string, query?: Query) {
    if (!query || Object.keys(query).length === 0) {
        return path;
    }

    const searchParams = new URLSearchParams();

    if (query.include && query.include.length > 0) {
        searchParams.set('include', query.include.join(','));
    }

    if (query.fields) {
        Object.entries(query.fields).forEach(([key, value]) => {
            searchParams.set(`fields[${key}]`, value.join(','));
        });
    }

    if (query.sort) {
        searchParams.set('sort', query.sort);
    }

    Object.entries(query).forEach(([key, value]) => {
        if (!key.startsWith('filter[')) {
            return;
        }

        if (!Array.isArray(value)) {
            searchParams.set(key, value.toString());
        } else if (value.length > 0) {
            searchParams.set(key, value.join(','));
        }
    });

    if (query.page) {
        searchParams.set('page[number]', query.page.toString());
        searchParams.set('page[size]', itemsPerPage.toString());
    }

    return path + '?' + searchParams.toString();
}

function preparedGetParams(
    key: ResourceName,
    query: Query = {},
    id?: string | number,
) {
    let path = camelCaseToKebabCase(key);

    if (id) {
        path += `/${id}`;
    }

    const tags = [key, ...(query.include || [])];

    return {
        path: addQueryParams(path, query),
        tags,
    };
}

export class ApiEndpoints extends JsonApi {
    constructor(bearerToken?: string) {
        super(
            `${process.env.API_DOMAIN}${process.env.API_PATH}`,
            bearerToken ?? '',
            'en',
        );
    }

    async getClub<T>(query: Query = {}, id: string | number): Promise<T> {
        const { path, tags } = preparedGetParams('clubs', query, id);

        return await this.get(path, tags);
    }

    async getClubs<T>(query?: Query): Promise<T> {
        const { path, tags } = preparedGetParams('clubs', query);

        return await this.get(path, tags);
    }

    async updateClub(data: UpdateData): Promise<JsonApiClub> {
        return await this.patch(
            `clubs/${data.id}`,
            this.serialize('clubs', data),
        );
    }

    async createMember(data: FormMember): Promise<JsonApiMember> {
        const serializedData = this.serialize('members', data, {
            relationships: {
                club: 'clubs',
                membership: 'memberships',
                divisions: 'divisions',
            },
        });
        return await this.post('members', serializedData);
    }

    async attachMemberToDivisions(memberId: string, divisions: Division[]) {
        return await this.post(
            `members/${memberId}/relationships/divisions`,
            this.serialize('divisions', divisions),
        );
    }

    async getMembership<T>(query: Query = {}, id: string | number): Promise<T> {
        const { path, tags } = preparedGetParams('memberships', query, id);
        return await this.get(path, tags);
    }

    async getMemberships<T>(query?: Query): Promise<T> {
        const { path, tags } = preparedGetParams('memberships', query);
        return await this.get(path, tags);
    }

    async createMembership(data: Membership): Promise<JsonApiMembership> {
        const serializedData = this.serialize('memberships', data, {
            relationships: {
                club: 'clubs',
                membershipType: 'membership-types',
                paymentPeriod: 'payment-periods',
            },
        });
        return await this.post('memberships', serializedData);
    }

    async updateMembership<T>(data: UpdateData) {
        const relationships = {};

        if (Boolean(data.owner)) {
            Object.assign(relationships, { owner: 'members' });
        }

        const serializedData = this.serialize('memberships', data, {
            relationships,
        });
        return await this.patch<T>(`memberships/${data.id}`, serializedData);
    }

    async getMembershipType<T>(
        query: Query = {},
        id: string | number,
    ): Promise<T> {
        const { path, tags } = preparedGetParams('membershipTypes', query, id);

        return await this.get(path, tags);
    }

    async getMembershipTypes<T>(query?: Query): Promise<T> {
        const { path, tags } = preparedGetParams('membershipTypes', query);

        return await this.get(path, tags);
    }

    async updateMembershipType(data: UpdateData): Promise<JsonApiDivision> {
        return await this.patch(
            `membership-types/${data.id}`,
            this.serialize('membership-types', data),
        );
    }

    async getDivision<T>(query: Query = {}, id: string | number): Promise<T> {
        const { path, tags } = preparedGetParams('divisions', query, id);

        return await this.get(path, tags);
    }

    async getDivisions<T>(query?: Query): Promise<T> {
        const { path, tags } = preparedGetParams('divisions', query);

        return await this.get(path, tags);
    }

    async updateDivision(data: UpdateData): Promise<JsonApiDivision> {
        return await this.patch(
            `divisions/${data.id}`,
            this.serialize('divisions', data),
        );
    }
}
