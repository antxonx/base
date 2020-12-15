/** @module DeleteElement */
import {SPINNER_LOADER} from "@scripts/app";

/**
 * Eliminar un elemento del DOM
 *
 * @param {HTMLElement} element
 */
export const deleteElement = (element: HTMLElement) => {
    element?.parentNode?.removeChild(element);
};

/**
 * Cambiar contenido de columnas por spinner loader
 *
 * @param {HTMLElement} element
 * @returns {string[]}
 */
export const disableRow = (element: HTMLElement): string[] => {
    const BTNS = element.getElementsByClassName("action-btn");
    const BTNS_BEF = [...BTNS].map(el => el.innerHTML);
    element.style.cssText = "opacity: 0.5;";
    [...element.getElementsByTagName("td")].forEach(el => el.classList.remove("cursor-pointer"));
    [...element.getElementsByTagName("th")].forEach(el => el.classList.remove("cursor-pointer"));
    [...BTNS].forEach(el => el.innerHTML = SPINNER_LOADER);
    return BTNS_BEF;
};


/**
 * Restaura fila a su estado original
 *
 * @param {HTMLElement} element
 * @param {string[]} btnBef
 */
export const restoreRow = (element: HTMLElement, btnBef: string[]) => {
    const BTNS = element.getElementsByClassName("action-btn");
    element.style.cssText = "opacity: 1;";
    [...element.getElementsByTagName("td")].forEach(el => el.classList.add("cursor-pointer"));
    [...element.getElementsByTagName("th")].forEach(el => el.classList.add("cursor-pointer"));
    [...BTNS].forEach((el, index) => el.innerHTML = btnBef[index]);
};
