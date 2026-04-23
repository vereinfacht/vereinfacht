import { TMediaDeserialized } from '@/types/resources';

export type ResourceName =
    | 'members'
    | 'memberships'
    | 'divisions'
    | 'divisionMembershipTypes'
    | 'clubs'
    | 'membershipTypes';

export type DetailFieldDef<T> =
    | DefaultDetailFieldDef<T>
    | BelongsToDetailFieldDef<T>
    | SimpleDetailFieldDef<T>
    | BelongsToManyDetailFieldDef<T>
    | MediaDetailField<T>;

export type DefaultDetailFieldDef<T> = {
    attribute: keyof T;
    label?: string;
    help?: string;
    value?: number | string;
    formatValue?: (value: string | number) => string | number;
};

export interface SimpleDetailFieldDef<T> extends DefaultDetailFieldDef<T> {
    type:
        | 'image'
        | 'link'
        | 'color'
        | 'date'
        | 'translation'
        | 'currency'
        | 'boolean'
        | 'media'
        | 'html';
}

export interface BelongsToDetailFieldDef<T, K = any> extends Omit<
    DefaultDetailFieldDef<T>,
    'value'
> {
    type: 'belongsTo';
    fields: DetailFieldDef<K>[];
    value: K;
}

export interface BelongsToManyDetailFieldDef<T, K = any> extends Omit<
    DefaultDetailFieldDef<T>,
    'value'
> {
    type: 'belongsToMany';
    value: K[];
    basePath?: string;
    displayProperty?: string;
}

export interface MediaDetailField<T> extends Omit<
    DefaultDetailFieldDef<T>,
    'value'
> {
    type: 'media';
    value: TMediaDeserialized[];
}
