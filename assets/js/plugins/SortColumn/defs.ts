export interface SortColumnOrder {
    column: string;
    order: string;
}

export enum SortIcons {
    SORT_UP = '<span class="float-right sort-icon"><i class="fas fa-sort-up"></i></span>',
    SORT_DOWN = '<span class="float-right sort-icon"><i class="fas fa-sort-down"></i></span>',
    SORT_NORMAL = '<span class="float-right sort-icon"><i class="fas fa-sort"></i></span>',
    SORT_ICON_ATTR = "sort-icon",
    SORT_ACT_ATTR = "sort-active",
    SORT_COL_ATTR = "column",
    SORT_COL_CLASS = "sort-column",
}

export interface SortColumOptions {
    table: HTMLElement;
    callback?: (order: SortColumnOrder) => void;
}

export const DEFAULT_SORT_COLUMN_OPTIONS : SortColumOptions = {
    table: document.createElement("table"),
    callback: () => {},
};
