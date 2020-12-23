/**
 * Set a select dropdown
 * @packageDocumentation
 * @module DropdownSelect
 * @preferred
 */
import { DropdownSelectOptions, DropdownSelectValue, DEFAULT_DROPDOWN_SELECT_OPTIONS } from "./defs";
import HtmlToElement from "@scripts/components/HtmlToElement";

/**
* Manages a select behavior
*
* @export
* @class DropdownSelect
* @author Antxony <dantonyofcarim@gmail.com>
*/
export default class DropdownSelect {

    protected options: DropdownSelectOptions;

    protected values: ReadonlyArray<DropdownSelectValue>;

    protected select: HTMLElement;

    protected value: string;

    protected choosing: boolean;

    public constructor(options?: DropdownSelectOptions) {
        this.options = {...DEFAULT_DROPDOWN_SELECT_OPTIONS, ...options};
        if(options) {
            if(!this.options.element.getAttribute('options')) {
                throw new Error("No se pudo inciar el select: No hay opciones");
            }
            this.values = JSON.parse(this.options.element.getAttribute('options')!) as ReadonlyArray<DropdownSelectValue>;
            this.options.element.setAttribute('options', '');
            this.options.element.classList.add("dropdown-select-input");
        } else {
            this.values = [];
        }
        this.value = '';
        this.select = document.createElement("div");
        this.choosing = false;
    }

    public load = () => {
        let list = '<ul class="list-group dropdown-select hide" id="categoryList">';
        this.values.forEach((val) => {
            list += `<li class="list-group-item hover cursor-pointer" name="${val.name}" value="${val.value}">${val.view}</li>`;
        });
        list += '</ul>';
        this.select = HtmlToElement(list);
        this.options.element.parentElement!.appendChild(this.select);
        this.options.element.addEventListener("click", this.toggle);
        this.options.element.parentElement?.addEventListener("focusout", this.focusout);
        Array.from(this.select.getElementsByTagName("li")).forEach(el => el.addEventListener("click", this.selectOption));
        this.select.addEventListener("mouseenter", () => { this.choosing = true; });
        this.select.addEventListener("mouseleave", () => { this.choosing = false; });
        return this;
    }

    private focusout = () => {
        if(!this.choosing) {
            this.select.classList.remove("show");
            this.select.classList.add("hide");
            this.options.element.classList.remove("open");
        }
    }

    private toggle = () => {
        if(this.options.element.classList.contains("open")) {
            this.select.classList.remove("show");
            this.select.classList.add("hide");
            this.options.element.classList.remove("open");
        } else {
            this.select.classList.remove("hide");
            this.select.classList.add("show");
            this.options.element.classList.add("open");
        }
    }

    private selectOption = (e: Event) => {
        const OPT = (e.currentTarget as HTMLElement);
        Array.from(this.select.getElementsByTagName("li")).forEach(el => el.classList.remove("active"));
        OPT.classList.add("active");
        this.value = OPT.getAttribute("value")!;
        this.options.element.setAttribute('value', OPT.getAttribute("name")!);
        this.options.element.setAttribute('option', this.value);
        this.toggle();
        this.options.callback!(this.value);
    }

    public getValue = () => {
        return this.value;
    }

}
