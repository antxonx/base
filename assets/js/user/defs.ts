/**
* @packageDocumentation
* @module User
*/

export interface DeleteReactiveOptions {
    element: HTMLElement;
    onSuccess?: () => void;
    onError?: () => void;
    id?: number;
    name?: string;
    username?: string
}

export const DEFAULT_DELETE_REACTIVE_OPTIONS: DeleteReactiveOptions = {
    element: document.createElement("div"),
    onSuccess: () => {
    },
    onError: () => {
    },
    id: 0,
    name: '',
    username: '',
};

export interface keyOptions {
    element?: HTMLElement;
    id?: number;
    name?: string;
    username?: string
}

export const DEFAULT_KEY_OPTIONS: keyOptions = {
    element: document.createElement("div"),
    id: 0,
    name: '',
    username: '',
};

export interface EditOptions {
    id: number;
    callback?: () => void;
}

export const DEFAULT_EDIT_OPTIONS: EditOptions = {
    id: 0,
    callback: () => {
    },
}
