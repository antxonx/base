/**
 * Check buttons and switch
 * @packageDocumentation
 * @module ButtonCehckGroup
 * @preferred
 */
import {checkAttributes, checkOptions, DEFAULT_CHECK_OPTIONS} from "./defs";

/**
 * ButtonCehckGroup class (button checkboxes or switch)
 *
 * @export
 * @class ButtonCheckGroup
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class ButtonCheckGroup {
    /**
     * Parent container
     *
     * @private
     * @type {HTMLElement}
     * @memberof ButtonCheckGroup
     */
    private container: HTMLElement;

    /**
     * container id
     *
     * @private
     * @type {string}
     * @memberof ButtonCheckGroup
     */
    private id: string;

    /**
     * Active check/s value/s
     *
     * @private
     * @type {string[]}
     * @memberof ButtonCheckGroup
     */
    private value: string[];

    /**
     * Options
     *
     * @private
     * @type {checkOptions}
     * @memberof ButtonCheckGroup
     */
    private options: checkOptions;

    /**
     *Creates an instance of ButtonCheckGroup.
     * @param {HTMLElement} container
     * @param {checkOptions} [options=DEFAULT_CHECK_OPTIONS]
     * @memberof ButtonCheckGroup
     */
    public constructor(container: HTMLElement, options: checkOptions = DEFAULT_CHECK_OPTIONS) {
        this.options = {...DEFAULT_CHECK_OPTIONS, ...options};
        this.container = container;
        this.id = this.container.getAttribute(checkAttributes.ID)!;
        this.value = [];
        [...this.container.getElementsByTagName('button')].forEach((el) => {
            el.setAttribute(checkAttributes.ID, ButtonCheckGroup.randmonId().toString());
            el.setAttribute(checkAttributes.STATUS, '0');
            if (this.options.extraClass && this.options.extraClass != '')
                el.classList.add(this.options.extraClass);
            el.classList.add(this.options.unCheckClass!);
            el.addEventListener('click', this.update);
        });
    }

    /**
     * update event
     *
     * @private
     * @memberof ButtonCheckGroup
     */
    private update = (e: Event) => {
        const BUTTON = (e.currentTarget as HTMLButtonElement);
        const ID = BUTTON.getAttribute(checkAttributes.ID);
        const STATUS = !!(+BUTTON.getAttribute(checkAttributes.STATUS)!);
        if (STATUS) {
            this.unmarkActive(BUTTON);
        } else {
            this.markActive(BUTTON);
        }
        if (!this.options.multiple) {
            [...this.container.querySelectorAll<HTMLButtonElement>('button[status="1"]')]
                .forEach((el) => {
                    if (el.getAttribute(checkAttributes.ID) != ID) {
                        this.unmarkActive(el);
                    }
                });
        }
        this.value = [...this.container.querySelectorAll<HTMLButtonElement>('button[status="1"]')]
            .map<string>((el: HTMLButtonElement) => el.getAttribute(checkAttributes.VALUE)!);
        this.options.onChange!(this.value);
    }

    /**
     * set active to a checkbox
     *
     * @private
     * @param {HTMLButtonElement} button
     * @memberof ButtonCheckGroup
     */
    private markActive(button: HTMLButtonElement) {
        button.classList.remove(this.options.unCheckClass!);
        button.classList.add(this.options.checkClass!);
        button.setAttribute(checkAttributes.STATUS, '1');
    }

    /**
     * unset active to a checkbox
     *
     * @private
     * @param {HTMLButtonElement} button
     * @memberof ButtonCheckGroup
     */
    private unmarkActive(button: HTMLButtonElement) {
        button.classList.remove(this.options.checkClass!);
        button.classList.add(this.options.unCheckClass!);
        button.setAttribute(checkAttributes.STATUS, '0');
    }

    /**
     * Generate a random id
     *
     * @private
     * @returns {number}
     * @memberof ButtonCheckGroup
     */
    private static randmonId(): number {
        return Math.floor((Math.random() * 100000) + 1000);
    }

    public getId = () => {
        return this.id;
    }
}
