/** @module Paginator */
import {DEFAULT_PAGINATOR_OPTIONS, PaginatorOptions} from "./defs";

/**
 * Paginator class
 *
 * @export
 * @class Paginator
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Paginator {
    private readonly options: PaginatorOptions;

    /**
     * Creates an instance of Paginator.
     * @param {PaginatorOptions} [options=DEFAULT_PAGINATOR_OPTIONS]
     * @memberof Paginator
     */
    public constructor(options: PaginatorOptions = DEFAULT_PAGINATOR_OPTIONS) {
        this.options = {...DEFAULT_PAGINATOR_OPTIONS, ...options};
        let elements: HTMLCollectionOf<Element>
        elements = this.options.elements || document.getElementsByClassName(this.options.classname!);
        [...elements].forEach(element => element.addEventListener("click", this.changePage));
    }

    /**
     * Change page
     *
     * @memberof Paginator
     */
    public changePage = (e: Event) => {
        e.preventDefault();
        this.options.callback(+(e.currentTarget as HTMLElement).getAttribute(this.options.indexname!)!);
    }
}
