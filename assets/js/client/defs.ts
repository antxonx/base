/**
 * DeleteOptions
 *
 * @export
 * @interface DeleteOptions
 */
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

/**
 * ShowOptions
 *
 * @export
 * @interface ShowOptions
 */
export interface ShowOptions {
    id: number;
    callback: () => void;
}

export const DEFAULT_SHOW_OPTIONS : ShowOptions = {
    id: 0,
    callback: () => {}
}
