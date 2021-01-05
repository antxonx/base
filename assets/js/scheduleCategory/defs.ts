/**
* @packageDocumentation
* @module Schedule/Category
*/

import { ConfigTypes } from "@scripts/app";

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
    onError?: () => void;
    onSuccess?: () => void;
}

export const DEFAULT_SCHEDULE_CATEGORY_DELETE_OPTIONS: ScheduleCategoryDeleteOptions = {
    element: document.createElement("div"),
    onError: () => {
    },
    onSuccess: () => {
    },
};

export interface ScheduleCategoryShowOptions {
    idCategory: number;
    onClose: () => void;
}

export const DEFAULT_SCHEDULE_CATEGORY_SHOW_OPTIONS: ScheduleCategoryShowOptions = {
    idCategory: 0,
    onClose: () => {
    },
};

export interface ScheduleCategoryColorOptions {
    id?: number;
    type?: 'background' | 'text';
    actualColor?: string;
    newColor?: string;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_CATEGORY_COLOR_OPTIONS: ScheduleCategoryColorOptions = {
    id: 0,
    type: 'background',
    actualColor: '#ffffff',
    newColor: '',
    callback: () => { }
};