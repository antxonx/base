let ONCHANGE: (state: boolean, id?: string) => void;

/**
 *Cambiar estado del botón
 *
 * @param {Event} e
 */
const toggleState = (e: Event) => {
    const BUTTON = (e.currentTarget as HTMLElement);
    const STATE = !!(+BUTTON.getAttribute("checkedB")!);
    if (STATE) {
        BUTTON.classList.remove("btn-success");
        BUTTON.classList.add("btn-outline-success");
    } else {
        BUTTON.classList.add("btn-success");
        BUTTON.classList.remove("btn-outline-success");
    }
    BUTTON.setAttribute("checkedB", (+!STATE).toString());
    ONCHANGE(!STATE, BUTTON.getAttribute("id")!);
};

/**
 * Marcar un botón como no activado
 *
 * @param {HTMLElement} button
 */
export const unMarkActive = (button: HTMLElement) => {
    button.classList.remove("btn-success");
    button.classList.add("btn-outline-success");
    button.setAttribute("checkedB", '0');
};

/**
 *Cargar evento al clickear botón
 *
 * @param {HTMLElement} button
 * @param {*} [onChange=(state : boolean) => {}]
 */
export const initButtonCheck = (button: HTMLElement, onChange = (state: boolean, id?: string) => { }) => {
    ONCHANGE = onChange;
    button.addEventListener("click", toggleState);
};

/**
 *Devolver estado actual del botón
 *
 * @param {HTMLElement} button
 * @returns
 */
export const getStatus = (button: HTMLElement) => {
    return !!(+button.getAttribute("checkedB")!);
};