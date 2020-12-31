/**
* @packageDocumentation
* @module Client/Contact
*/

export interface AddOptions {
    id: number;
    callback: () => void;
}

export const DEFAULT_ADD_OPTIONS: AddOptions = {
    id: 0,
    callback: () => { }
};

export interface showOptions {
    id: number;
    callback: () => void;
}

export const DEFAULT_SHOW_OPTIONS: showOptions = {
    id: 0,
    callback: () => { }
};
