export interface FormActionState {
    success: boolean;
    errors?: Record<string, string[]>;
}

export type FormAction = (
    previousState: FormActionState,
    formData: FormData,
) => Promise<FormActionState>;

export interface ActionState {
    message?: string;
    errors?: {
        [x: string]: string[] | undefined;
        [x: number]: string[] | undefined;
    };
}

export type UpdateAction = (
    id: string,
    previousState: ActionState,
    formData: FormData,
) => Promise<ActionState>;
