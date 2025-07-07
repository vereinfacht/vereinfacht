import {
    deserialize,
    DocumentObject,
    serialize,
    SerializeOptions,
} from 'jsonapi-fractal';

interface JsonApiValidationErrorObject {
    detail: string;
    source: {
        pointer: string;
    };
    status: '422';
    title: 'Unprocessable Entity';
}

export interface AuthHeaders {
    Authorization?: string;
}

interface JsonApiRequestObject {
    method: string;
    path: string;
    data?: any;
    headers?: AuthHeaders;
    revalidate?: number;
    tags?: NextFetchRequestConfig['tags'];
}

export class ValidationError extends Error {
    constructor(public errors: JsonApiValidationErrorObject[]) {
        super(errors[0].detail);
        this.name = 'ValidationError';
    }
}

export class JsonApi {
    constructor(
        private baseUrl: string,
        private bearerToken: string,
        public locale: string,
    ) {}

    setLocale(locale: string) {
        this.locale = locale;
    }

    public serialize(entity: string, data: object, options?: SerializeOptions) {
        return serialize(data, entity, options);
    }

    public deserialize<T>(data: DocumentObject): T | T[] | undefined {
        return deserialize<T>(data);
    }

    protected async handleError(response: Response) {
        if (response.status !== 422) {
            throw new Error(response.statusText);
        }

        if (response.status === 422) {
            const validationError = await response.json();
            throw new ValidationError(validationError.errors);
        }
    }

    private async request({
        method,
        path,
        data,
        headers,
        revalidate = 60 * 5, // cache requests for 5 minutes
        tags,
    }: JsonApiRequestObject) {
        const response = await fetch(`${this.baseUrl}/${path}`, {
            method,
            headers: {
                'Content-Type': 'application/vnd.api+json',
                Accept: 'application/vnd.api+json',
                'Accept-Language': this.locale,
                Authorization: `Bearer ${this.bearerToken}`,
                Origin: this.baseUrl,
                ...headers,
            },
            body: JSON.stringify(data),
            next: { revalidate, tags },
        });

        if (!response.ok) {
            return await this.handleError(response);
        }

        return await response.json();
        // const responseData = await response.json();
        // return this.deserialize<T>(responseData);
    }

    async post<T>(
        path: string,
        data: any,
        headers: AuthHeaders = {},
    ): Promise<T> {
        return await this.request({
            method: 'POST',
            path,
            data,
            headers,
            revalidate: 0,
        });
    }

    async get<T>(
        path: string,
        tags?: NextFetchRequestConfig['tags'],
    ): Promise<T> {
        return await this.request({
            method: 'GET',
            path,
            tags,
        });
    }

    async patch<T>(path: string, data: DocumentObject): Promise<T> {
        return await this.request({
            method: 'PATCH',
            path,
            data,
            revalidate: 0,
        });
    }

    async delete<T>(path: string): Promise<T> {
        return await this.request({ method: 'DELETE', path, revalidate: 0 });
    }
}
