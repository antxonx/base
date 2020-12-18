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
