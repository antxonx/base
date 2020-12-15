/** @module Search */
import {DEFAULT_SEARCH_OPTIONS, SearchOptions} from './defs';

/**
 * Search class
 *
 * @export
 * @class Search
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Search
{
    /**
     * timer
     *
     * @private
     * @type {(NodeJS.Timeout | undefined)}
     * @memberof Search
     */
    private timer :  NodeJS.Timeout | undefined;

    /**
     * Creates an instance of Search.
     * @param {SearchOptions} [options=DEFAULT_SEARCH_OPTIONS]
     * @memberof Search
     */
    public constructor(options: SearchOptions = DEFAULT_SEARCH_OPTIONS) {
        const COMPONENT = options.element || document.querySelector(options.selector!) as HTMLInputElement;
        const ERASE_COMPS = COMPONENT.closest('.search-input')!.getElementsByClassName('erase-search');
        COMPONENT.addEventListener("input", () => {
            if(this.timer != undefined){
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                const DATA = COMPONENT.value;
                this.timer = undefined;
                options.callback(DATA);
            }, 500);
        });
        if(ERASE_COMPS && ERASE_COMPS.length > 0) {
            ERASE_COMPS[0].addEventListener('click', () => {
                if(COMPONENT.value !== ""){
                    COMPONENT.value = "";
                    options.callback("");
                }
            })
        }
    }
}
