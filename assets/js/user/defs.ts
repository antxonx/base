export interface DeleteOptions {
    element?: HTMLElement;
    onSuccess?: () => void;
    onError?: () => void;
    id?: number;
    name?: string;
    username?: string
}

export const DEFAULT_DELETE_OPTIONS :DeleteOptions = {
    element: document.createElement("div"),
    onSuccess: () => {},
    onError: () => {},
    id: 0,
    name: '',
    username: '',
};
