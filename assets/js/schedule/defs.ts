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
}

export const DEFAULT_SCHEDULE_SHOW_OPTIONS : ScheduleShowOptions = {
    element: document.createElement("div"),
    id: 0,
    bColor: '',
    tColor: '',
}
