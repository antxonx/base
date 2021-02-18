/**
* @packageDocumentation
* @module Schedule
*/

export declare type ScheduleType = 'week' | 'month' | 'day';

export interface ScheduleShowOptions {
    element?: HTMLElement;
    id?: number;
    bColor?: string;
    tColor?: string;
    callback?: () => void;
    recurrent: number;
}

export const DEFAULT_SCHEDULE_SHOW_OPTIONS: ScheduleShowOptions = {
    element: document.createElement("div"),
    id: 0,
    bColor: '',
    tColor: '',
    callback: () => { },
    recurrent: 0,
};

export interface ScheduleFinishOptions {
    id: number;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_FINISH_OPTIONS: ScheduleFinishOptions = {
    id: 0,
    callback: () => { },
};

export interface ScheduleAsignOptions {
    id?: number;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_ASIGN_OPTIONS: ScheduleAsignOptions = {
    id: 0,
    callback: () => { }
};

export interface ScheduleDeleteOptions {
    id?: number;
    callback?: () => void;
    onError?: () => void;
}

export const DEFAULT_SCHEDULE_DELETE_OPTIONS: ScheduleDeleteOptions = {
    id: 0,
    callback: () => { },
    onError: () => { }
};

export enum TASK_EDIT_TYPE {
    ASING = 1,
    PRIORITY,
    DATE
};