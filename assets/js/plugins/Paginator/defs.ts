/**
 * @packageDocumentation
 * @module Paginator
 */
export declare type PaginatorCallback = (page: number) => void;

/**
 * Paginator options
 *
 * @export
 * @interface PaginatorOptions
 */
export interface PaginatorOptions {
    callback: PaginatorCallback;
    classname?: string;
    elements?: HTMLCollectionOf<Element>;
    indexname?: string;
}

export const DEFAULT_PAGINATOR_OPTIONS: PaginatorOptions = {
    callback: () => {},
    classname: 'paginator',
    indexname: 'page-index',
};
