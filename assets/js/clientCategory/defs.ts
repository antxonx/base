/**
 * ClientCategoryOptions interface
 *
 * @export
 * @interface ClientCategoryOptions
 */
export interface ClientCategoryOptions {
    control?: boolean,
    extern?: boolean,
}

export const DEFAULT_CLIENT_CATEGORY_OPTIONS: ClientCategoryOptions = {
    control: true,
    extern: false
};

export interface ClientCategoryDeleteOptions {
    element: HTMLElement;
    onError?: () => void
    onSuccess?: () => void
}

export const DEFAULT_CLIENT_CATEGORY_DELETE_OPTIONS : ClientCategoryDeleteOptions = {
    element: document.createElement("div"),
    onError: () => {},
    onSuccess: () => {},
}
