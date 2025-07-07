import { ResourceName } from '@/resources/resource';

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

export interface ResourceShowPageParams extends ResourcePageParams {
    id: string;
}

export type ResourceEditPageParams = ResourceShowPageParams;

export type SecurePageParams = LocalizedPageParams;
