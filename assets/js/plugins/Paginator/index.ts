import {DEFAULT_PAGINATOR_OPTIONS, PaginatorOptions} from "./defs";

export default class Paginator
{
    private readonly options: PaginatorOptions;

    public constructor(options : PaginatorOptions = DEFAULT_PAGINATOR_OPTIONS) {
        this.options = {...DEFAULT_PAGINATOR_OPTIONS, ...options};
        let elements :  HTMLCollectionOf<Element>
        elements = this.options.elements || document.getElementsByClassName(this.options.classname!);
        [...elements].forEach(element => element.addEventListener("click", this.changePage));
    }

    public changePage = (e: Event) => {
        e.preventDefault();
        this.options.callback(+(e.currentTarget as HTMLElement).getAttribute(this.options.indexname!)!);
    }
}
