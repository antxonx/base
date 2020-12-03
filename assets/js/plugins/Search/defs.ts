export declare type SearchCallback = (data: string) => void;

/**
 * Search options
 *
 * @export
 * @interface SearchOptions
 */
export interface SearchOptions {
    selector?: string;
    element?: HTMLInputElement;
    callback: SearchCallback;
}

export const DEFAULT_SEARCH_OPTIONS = {
  callback: () => {},
  selector: '#searchField',
};
