export declare type PaginatorCallback = (page: number) => void;

export interface PaginatorOptions {
    callback: PaginatorCallback;
    classname?: string;
    elements?:  HTMLCollectionOf<Element>;
    indexname?: string;
}

export const DEFAULT_PAGINATOR_OPTIONS : PaginatorOptions = {
    callback: () => {},
    classname: 'paginator',
    indexname: 'page-index',
};
