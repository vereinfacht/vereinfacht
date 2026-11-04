import { ResourceName } from '@/resources/resource';
import { SearchParams } from 'nuqs';

interface LocalizedRouteParams {
    locale: string;
}

interface ClubRouteParams extends LocalizedRouteParams {
    slug: string;
}

interface ResourceRouteParams extends LocalizedRouteParams {
    resource: ResourceName;
}

export type LocalizedPageParams = Promise<LocalizedRouteParams>;
export type ClubPageParams = Promise<ClubRouteParams>;
export type ResourcePageParams = Promise<ResourceRouteParams>;
export type ResourceIndexPageParams = ResourcePageParams;
export type ResourceShowPageParams = Promise<
    ResourceRouteParams & { id: string }
>;

export type WithSearchParams = {
    searchParams: Promise<SearchParams>;
};

export type ResourceEditPageParams = ResourceShowPageParams;

interface ShowRouteParams extends LocalizedRouteParams {
    id: string;
}

export type ShowPageParams = Promise<ShowRouteParams>;
export type EditPageParams = ShowPageParams;

export type SecurePageParams = LocalizedPageParams;
