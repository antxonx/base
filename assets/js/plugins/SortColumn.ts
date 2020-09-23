import DeleteElement from "./DeleteElement";
import { htmlToElement } from "./Required";

const SORT_UP = htmlToElement('<span class="float-right sort-icon"><i class="fas fa-sort-up"></i></span>');
const SORT_DOWN = htmlToElement('<span class="float-right sort-icon"><i class="fas fa-sort-down"></i></span>');
const SORT_NORMAL = '<span class="float-right sort-icon"><i class="fas fa-sort"></i></span>';
const SORT_ICON_ATTR = "sort-icon";
const SORT_ACT_ATTR = "sort-active";
const SORT_COL_ATTR = "column";
const SORT_COL_CLASS = "sort-column";

let SORT_COLUM: SortColumn = {
    column: "id",
    order: "ASC"
};

export interface SortColumn {
    column: string;
    order: string;
}

/**
 * conseguir el nuevo orden para los elementos
 *
 * @param {HTMLElement} element
 * @returns {string}
 */
export default (element: HTMLElement): SortColumn => {
    restartIcons();
    let newValue = 0;
    let newIcon = htmlToElement(SORT_NORMAL);
    if (element.getAttribute(SORT_ACT_ATTR) == undefined || element.getAttribute(SORT_ACT_ATTR) == null) {
        newValue = 2;
        newIcon = SORT_UP;
        SORT_COLUM.order = "ASC";
    } else if (+element.getAttribute(SORT_ACT_ATTR)! == 1 || +element.getAttribute(SORT_ACT_ATTR)! == 0) {
        newValue = 2;
        newIcon = SORT_UP;
        SORT_COLUM.order = "ASC";
    } else if (+element.getAttribute(SORT_ACT_ATTR)! == 2) {
        newValue = 1;
        newIcon = SORT_DOWN;
        SORT_COLUM.order = "DESC";
    }
    element.setAttribute(SORT_ACT_ATTR, newValue.toString());
    DeleteElement(element.getElementsByClassName(SORT_ICON_ATTR)[ 0 ] as HTMLElement);
    element.appendChild<HTMLElement>(newIcon);
    SORT_COLUM.column = element.getAttribute(SORT_COL_ATTR)!;
    return SORT_COLUM;
};

/**
 * Reiniciar íconos al original `SORT_NORMAL`
 *
 */
const restartIcons = () => {
    [ ...document.getElementsByClassName(SORT_COL_CLASS) ].forEach(el => {
        DeleteElement(el.getElementsByClassName(SORT_ICON_ATTR)[ 0 ] as HTMLElement);
    });
    [ ...document.getElementsByClassName(SORT_COL_CLASS) ].forEach(el => {
        el.appendChild<HTMLElement>(htmlToElement(SORT_NORMAL));
    });

};