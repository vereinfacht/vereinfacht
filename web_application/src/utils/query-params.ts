export function prepareQuery(params: any) {
    const queryParams: Record<string, string | number | string[]> = {};

    if (params.page?.size) {
        queryParams['page[size]'] = params.page.size;
    }

    if (params.page?.number) {
        queryParams['page[number]'] = params.page.number;
    }

    if (params.sort) {
        queryParams.sort = params.sort;
    }

    if (params.filter) {
        Object.entries(params.filter).forEach(([key, value]) => {
            if (value === undefined || value === null) {
                return;
            }

            if (Array.isArray(value)) {
                queryParams[`filter[${key}]`] = value;
            } else {
                queryParams[`filter[${key}]`] = String(value);
            }
        });
    }

    if (params.include) {
        queryParams.include = params.include.join(',');
    }

    if (params.fields) {
        Object.entries(params.fields).forEach(([key, value]: any[]) => {
            queryParams[`fields[${key}]`] = value.join(',');
        });
    }

    if (params.id) {
        queryParams.id = params.id.toString();
    }

    return Object.keys(queryParams).length > 0 ? queryParams : {};
}
