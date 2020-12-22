/**
* @packageDocumentation
* @module Schedule
*/

export declare type ScheduleType = 'week'|'month'|'day'

export interface ScheduleShowOptions {
    element?: HTMLElement;
    id?: number;
    bColor?: string;
    tColor?: string;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_SHOW_OPTIONS : ScheduleShowOptions = {
    element: document.createElement("div"),
    id: 0,
    bColor: '',
    tColor: '',
    callback: () => {}
}

export interface ScheduleFinishOptions {
    id: number;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_FINISH_OPTIONS : ScheduleFinishOptions = {
    id: 0,
    callback: () => {},
}

export interface ScheduleAsignOptions {
    id?: number;
    callback?: () => void;
}

export const DEFAULT_SCHEDULE_ASIGN_OPTIONS : ScheduleAsignOptions = {
    id: 0,
    callback: () => {}
}
