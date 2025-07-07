import { getAny, getOne } from '@/actions/fetchAdminResources';
import { ActionState } from '@/actions/validateForm';
import { Query } from '@/services/api-endpoints';
import { SupportedLocale, defaultLocale } from '@/utils/localization';
import { ColumnDef } from '@tanstack/react-table';
import { Translate } from 'next-translate';
import { z } from 'zod';

export type ResourceName =
    | 'memberships'
    | 'divisions'
    | 'divisionMembershipTypes'
    | 'clubs'
    | 'membershipTypes';

export type DetailFieldDef<T> =
    | DefaultDetailFieldDef<T>
    | BelongsToDetailFieldDef<T>
    | SimpleDetailFieldDef<T>
    | BelongsToManyDetailFieldDef<T>;

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
        | 'boolean';
}

export interface BelongsToDetailFieldDef<T, K = any>
    extends Omit<DefaultDetailFieldDef<T>, 'value'> {
    type: 'belongsTo';
    fields: DetailFieldDef<K>[];
    value: K;
}

export interface BelongsToManyDetailFieldDef<T, K = any>
    extends Omit<DefaultDetailFieldDef<T>, 'value'> {
    type: 'belongsToMany';
    value: K[];
}

export class Resource<T> {
    name: ResourceName;
    locale: SupportedLocale = defaultLocale;
    showInNavigation: boolean = false;
    // @TODO: implement permission system
    canIndex: boolean = false;
    canView: boolean = false;
    canEdit: boolean = false;
    updateAction = async (
        _id: string,
        _previousState: ActionState,
        _formData: FormData,
    ) => await {};
    getUpdateSchema = async () => z.object({});

    constructor(name: ResourceName) {
        this.name = name;
    }

    setLocale(locale: SupportedLocale) {
        this.locale = locale;
    }

    getIndexResources(query: Query = {}) {
        // @TODO: prevent even fetching resources when not allowed
        return getAny<T[]>(this.name, null, query, this.locale);
    }

    getIndexColumns(
        _t: Translate,
        _formatCurrency: (value: number) => string,
    ): ColumnDef<T, unknown>[] {
        return [];
    }

    getShowResource(query: Query = {}, id: string) {
        // @TODO: prevent even fetching resources when not allowed
        return getOne<T>(this.name, id, query, this.locale);
    }

    getDetailFields(_t: Translate): DetailFieldDef<T>[] {
        return [];
    }
}
