export interface DeleteOptions {
    element: HTMLElement;
    id?: number;
    name?: string;
    onSuccess?: () => void;
    onError?: () => void;
}

export const DEFAULT_DELETE_OPTIONS : DeleteOptions = {
    element: document.createElement("div"),
    id: 0,
    name: '',
    onSuccess: () => {},
    onError: () => {},
}
