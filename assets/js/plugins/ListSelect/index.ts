import {DEFAULT_LIST_SELECT_OPTIONS, ListSelectNames, ListSelectOptions} from "@plugins/ListSelect/defs";

export default class ListSelect
{
    protected options : ListSelectOptions;
    public constructor(options : ListSelectOptions) {
        this.options = {...DEFAULT_LIST_SELECT_OPTIONS, ...options};
    }

    public load = () => {
        const LIST = this.options.element.getElementsByTagName(ListSelectNames.LIST_ELEMENT);
        Array.from(LIST).forEach(el => el.addEventListener('click', () => {
            const STATE : boolean = el.classList.contains(ListSelectNames.ACTIVE_CLASS);
            if(this.options.multiple){
                this.toggle(el, ListSelectNames.ACTIVE_CLASS);
            } else {
                Array.from(LIST).forEach(el => el.classList.remove(ListSelectNames.ACTIVE_CLASS));
                if(!STATE) {
                    el.classList.add(ListSelectNames.ACTIVE_CLASS);
                }
            }
            this.options.callback!(Array.from(LIST).map(el => {
                if(el.classList.contains(ListSelectNames.ACTIVE_CLASS))
                    return el.getAttribute(this.options.attribute!)!
                else
                    return ""
            }).filter(data => data != ""));
        }));
    }

    private toggle = (element: HTMLElement, tClass : string = ListSelectNames.ACTIVE_CLASS) => {
        if(element.classList.contains(tClass)) {
            element.classList.remove(tClass);
        } else {
            element.classList.add(tClass);
        }
    }
}
