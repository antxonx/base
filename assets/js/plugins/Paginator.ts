let CALLBACK: (page: number) => void = () => {
};

/**
 *Cambiar de página
 *
 * @param {Event} e
 */
const changePage = (e: Event) => {
    e.preventDefault();
    CALLBACK(+(e.currentTarget as HTMLElement).getAttribute("page-index")!);
};

/**
 * Iniciar paginación
 *
 * @param {(page: number) => void} [callback=CALLBACK]
 */
export const initialize = (callback: (page: number) => void = CALLBACK) => {
    CALLBACK = callback;
    [...document.getElementsByClassName("paginator")].forEach(element => element.addEventListener("click", changePage));
};
