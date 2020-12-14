import {DEFAULT_SORT_COLUMN_OPTIONS, SortColumnOrder, SortColumOptions, SortIcons} from "@plugins/SortColumn/defs";
import {deleteElement} from "@plugins/DeleteElement";
import {htmlToElement} from "@plugins/Required";

export default class SortColumn {
    protected sort : SortColumnOrder;
    protected options : SortColumOptions;
    public constructor(options: SortColumOptions) {
        this.options = {...DEFAULT_SORT_COLUMN_OPTIONS, ...options};
        this.sort = {
            column: "id",
            order: "ASC"
        }
    }
    public load = () => {
        Array.from(this.options.table.querySelectorAll('th.sort-column')).forEach(el => {
            el.addEventListener('click', this.execute);
        })
    }

    private execute = (e: Event) => {
        const element = (e.currentTarget as HTMLElement);
        this.restart();
        let newValue = 0;
        let newIcon = htmlToElement(SortIcons.SORT_NORMAL);
        if (element.getAttribute(SortIcons.SORT_ACT_ATTR) == undefined || element.getAttribute(SortIcons.SORT_ACT_ATTR) == null) {
            newValue = 2;
            newIcon = htmlToElement(SortIcons.SORT_UP);
            this.sort.order = "ASC";
        } else if (+element.getAttribute(SortIcons.SORT_ACT_ATTR)! == 1 || +element.getAttribute(SortIcons.SORT_ACT_ATTR)! == 0) {
            newValue = 2;
            newIcon = htmlToElement(SortIcons.SORT_UP);
            this.sort.order = "ASC";
        } else if (+element.getAttribute(SortIcons.SORT_ACT_ATTR)! == 2) {
            newValue = 1;
            newIcon = htmlToElement(SortIcons.SORT_DOWN);
            this.sort.order = "DESC";
        }
        element.setAttribute(SortIcons.SORT_ACT_ATTR, newValue.toString());
        deleteElement(element.getElementsByClassName(SortIcons.SORT_ICON_ATTR)[0] as HTMLElement);
        element.appendChild<HTMLElement>(newIcon);
        this.sort.column = element.getAttribute(SortIcons.SORT_COL_ATTR)!;
        this.options.callback!(this.sort);
    }

    private restart = () => {
        [...document.getElementsByClassName(SortIcons.SORT_COL_CLASS)].forEach(el => {
            deleteElement(el.getElementsByClassName(SortIcons.SORT_ICON_ATTR)[0] as HTMLElement);
        });
        [...document.getElementsByClassName(SortIcons.SORT_COL_CLASS)].forEach(el => {
            el.appendChild<HTMLElement>(htmlToElement(SortIcons.SORT_NORMAL));
        });
    }

    public getSort = () : SortColumnOrder => {
        return this.sort;
    }

}
