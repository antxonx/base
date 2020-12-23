/**
 * @packageDocumentation
 * @module DropdownSelect
 */

export interface DropdownSelectOptions {
    element: HTMLElement;
    callback?: (value: string) => void;
}

export const DEFAULT_DROPDOWN_SELECT_OPTIONS: DropdownSelectOptions = {
    element: document.createElement("div"),
    callback: () => { }
};

export interface DropdownSelectValue {
    value: string;
    view: string;
    name: string;
}
