/**
* @packageDocumentation
* @module Schedule/Priority
*/

export interface SchedulePriorityOptions {
    control?: boolean,
    extern?: boolean,
}

export const DEFAULT_PRIORITY_OPTIONS: SchedulePriorityOptions = {
    control: true,
    extern: false
};

export interface SchedulePriorityDeleteOptions {
    element: HTMLElement;
    onError?: () => void;
    onSuccess?: () => void;
}

export const DEFAULT_PRIORITY_DELETE_OPTIONS: SchedulePriorityDeleteOptions = {
    element: document.createElement("div"),
    onError: () => {
    },
    onSuccess: () => {
    },
};

export interface SchedulePriorityChangeOptions {
    idSchedule: number;
    onClose: () => void;
}

export const DEFAULT_PRIORITY_CHANGE_OPTIONS: SchedulePriorityChangeOptions = {
    idSchedule: 0,
    onClose: () => {
    },
};

export interface SchedulePriorityShowOptions {
    idPriority: number;
    onClose: () => void;
}

export const DEFAULT_PRIORITY_SHOW_OPTIONS: SchedulePriorityShowOptions = {
    idPriority: 0,
    onClose: () => {
    },
};

export interface SchedulePriorityColorOptions {
    id?: number;
    type?: 'background' | 'text';
    actualColor?: string;
    newColor?: string;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_PRIORITY_COLOR_OPTIONS: SchedulePriorityColorOptions = {
    id: 0,
    type: 'background',
    actualColor: '#ffffff',
    newColor: '',
    callback: () => { }
};
