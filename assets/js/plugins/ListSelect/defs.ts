export enum ListSelectNames {
    LIST_ELEMENT = 'li',
    ACTIVE_CLASS = 'active',
    READ_ATTRIBUTE = 'id',
}

export interface ListSelectOptions {
    element: HTMLElement;
    multiple?: boolean;
    attribute?: string
    callback?: (data: string[]) => void;
}

export const DEFAULT_LIST_SELECT_OPTIONS : ListSelectOptions = {
    element: document.createElement("div") as HTMLElement,
    multiple: false,
    attribute: ListSelectNames.READ_ATTRIBUTE,
    callback: () => {},
}
