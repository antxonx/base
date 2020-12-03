export declare type SearchCallback = (data: string) => void;

export interface SearchOptions {
    selector?: string;
    element?: HTMLInputElement;
    callback: SearchCallback;
}

export const DEFAULT_SEARCH_OPTIONS = {
  callback: () => {},
  selector: '#searchField',
};
