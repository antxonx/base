/**
* @packageDocumentation
* @module Client/Category
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

export const DEFAULT_CLIENT_CATEGORY_DELETE_OPTIONS: ClientCategoryDeleteOptions = {
    element: document.createElement("div"),
    onError: () => {
    },
    onSuccess: () => {
    },
}

export interface ClientCategoryChangeOptions {
    idClient: number;
    onClose: () => void;
}

export const DEFAULT_CLIENT_CATEGORY_CHANGE_OPTIONS: ClientCategoryChangeOptions = {
    idClient: 0,
    onClose: () => {
    },
}

export interface ClientCategoryShowOptions {
    idCategory: number;
    onClose: () => void;
}

export const DEFAULT_CLIENT_CATEGORY_SHOW_OPTIONS: ClientCategoryShowOptions = {
    idCategory: 0,
    onClose: () => {
    },
}
