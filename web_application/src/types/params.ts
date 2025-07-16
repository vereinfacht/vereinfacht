import { ResourceName } from '@/resources/resource';
import { SearchParams } from 'nuqs';

export interface LocalizedPageParams {
    lang: string;
}
export interface ClubPageParams extends LocalizedPageParams {
    slug: string;
}

export interface ResourcePageParams extends LocalizedPageParams {
    resource: ResourceName;
}

export interface ResourceIndexPageParams extends ResourcePageParams {
    resource: ResourceName;
}

export type ResourceShowPageParams = ResourcePageParams & ShowPageParams;

export type WithSearchParams = {
    searchParams: Promise<SearchParams>;
};

export type ResourceEditPageParams = ResourceShowPageParams;

export interface ShowPageParams extends LocalizedPageParams {
    id: string;
}

export type EditPageParams = ShowPageParams;

export type SecurePageParams = LocalizedPageParams;
