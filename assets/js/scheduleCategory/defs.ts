/**
* @packageDocumentation
* @module Schedule/Category
*/

export interface ScheduleCategoryOptions {
    control?: boolean,
    extern?: boolean,
}

export const DEFAULT_SCHEDULE_CATEGORY_OPTIONS: ScheduleCategoryOptions = {
    control: true,
    extern: false
};

export interface ScheduleCategoryDeleteOptions {
    element: HTMLElement;
    onError?: () => void
    onSuccess?: () => void
}

export const DEFAULT_SCHEDULE_CATEGORY_DELETE_OPTIONS: ScheduleCategoryDeleteOptions = {
    element: document.createElement("div"),
    onError: () => {
    },
    onSuccess: () => {
    },
}
