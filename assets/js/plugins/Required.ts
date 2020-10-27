/**
 * clase para elementos válidos
 * @const `string`
 */
const VALID_INPUT = 'is-valid';
/**
 * clase para elementos inválidos
 * @const `string`
 */
const INVALID_INPUT = 'is-invalid';
/**
 * clase para elementos exclusivos de error en un input
 * @const `string`
 */
const ERROR_INPUT = "error-input";
/**
 * Tipo de input `text`
 * @const `string`
 */
const TEXT_TYPE = "text";
/**
 * Tipo de input `password`
 * @const `string`
 */
const PASSWORD_TYPE = "password";
/**
 * Tipo de input `email`
 * @const `string`
 */
const EMAIL_TYPE = "email";
/**
 * Tipo de input `number`
 * @const `string`
 */
const NUMBER_TYPE = "number";
/**
 * expresión regular para tipos de dato de `email`
 * @const `regExp`
 */
const EMAIL_EXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 *Evalúa un sólo input según su tipo `text`, `password` o `email`.
 *
 * @param {HTMLInputElement} element
 * @param {number} [size=0]
 * @returns {boolean}
 */
const evaluateInput = (element: HTMLInputElement, size: number = 0): boolean => {
    //Toma el tipo de input desde el atributo `t-type`
    const TYPE = element.getAttribute("t-type");
    //.
    //Tomamos el valor del input
    const INPUT = element.value;
    //.
    let result = false;
    //Verificamos si el tipo de input coincide
    if (TYPE == TEXT_TYPE) {
        //Evaluamos que se cumpla la condición
        if (INPUT.length > size)
            result = true;
        //.
    } else if (TYPE == EMAIL_TYPE) {
        //Evaluamos que se cumpla la condición
        result = EMAIL_EXP.test(INPUT.toLowerCase());
        //.
    } else if (TYPE == PASSWORD_TYPE) {
        //Evaluamos que se cumpla la condición
        if (INPUT.length > size)
            result = true;
        //.
    } else if (TYPE == NUMBER_TYPE) {
        if (INPUT.length > 0 && !isNaN(+INPUT)) {
            result = +element.getAttribute("min")! <= +INPUT;
        }
    } else {
        //Si no coincide arrojamos un error
        throw "No se encontró el tipo de input para el elemento";
        //.
    }
    //.
    return result;
};

/**
 *Evalua varios inputs y determina si son válidos o no.
 *
 * @param {HTMLInputElement[]} elements
 * @param {number} size
 * @param submitBtn
 * @return {boolean}
 */
export const evaluateInputs = (elements: HTMLInputElement[], size: number = 0, submitBtn = true): boolean => {
    let result = true;
    clearErrorMsg();
    //Iteramos entre todos los elementos para validarlos uno por uno
    elements.forEach(element => {
        //Quitamos las clases de alguna evaluación anterior
        clearValidState(element);
        //.
        if (!element.classList.contains("no-required")) {
            if (evaluateInput(element, size)) {
                //Se le da formato a un input válido
                element.classList.add(VALID_INPUT);
                //.
            } else {
                //Se cambia a `falso` el resultado ya que al menos un dato es invalido
                result = false;
                //.
                setInvalidInput(element);
            }
        }
    });
    if (!result && submitBtn) {
        const BTN = document.getElementById("submit-btn")!;
        insertAlertAfter(BTN, "Hay campos inválidos en el formulario");
    }
    //.
    return result;
};

/**
 * Marcar input como inválido
 *
 * @param {HTMLElement} element
 */
export const setInvalidInput = (element: HTMLElement) => {
    //Se le da formato a un input inválido
    element.classList.remove(VALID_INPUT);
    element.classList.add(INVALID_INPUT);
    //.
    //Creamos un `<small>` con el mensaje de error del input
    const SMALL = document.createElement("small");
    SMALL.innerHTML = "*" + element.getAttribute("error-msg");
    SMALL.classList.add("text-danger");
    SMALL.classList.add(ERROR_INPUT);
    //.
    //Agregamos el mensaje de error justo debajo del input
    // element.parentNode.insertBefore(SAMLL, element) para insertar antes
    element.parentNode!.insertBefore(SMALL, element.nextSibling);
    //.
};

/**
 * Marcar como válido un input
 *
 * @param {HTMLElement} element
 */
export const setValidInput = (element: HTMLElement) => {
    //Se le da formato a un input válido
    element.classList.remove(INVALID_INPUT);
    element.classList.add(VALID_INPUT);
};

/**
 *Borramos mensajes de error para los inputs
 *
 */
export const clearErrorMsg = () => {
    [...document.getElementsByClassName(ERROR_INPUT)].forEach(n => n.remove());
};

/**
 * Cambiar estado de input, válido o inválido
 *
 * @param {HTMLInputElement} element
 */
export const clearValidState = (element: HTMLInputElement) => {
    element.classList.remove(VALID_INPUT);
    element.classList.remove(INVALID_INPUT);
};

export const insertAlertAfter = (element: HTMLElement, text: string) => {
    //Creamos una alerta para notificar que hay datos inválidos
    const ALERT = document.createElement("div");
    ALERT.innerHTML = text;
    ALERT.classList.add("alert");
    ALERT.classList.add("alert-danger");
    ALERT.classList.add("mt-2");
    ALERT.classList.add("mb-0");
    ALERT.classList.add(ERROR_INPUT);
    ALERT.classList.add("w-100");
    ALERT.classList.add("round");
    //.
    //Agregamos el mensaje de error justo debajo del botón
    element.parentNode!.insertBefore(ALERT, element.nextSibling);
    //.
};

export const hideElement = (element: HTMLElement) => {
    element.style.display = "none";
};
export const showElement = (element: HTMLElement) => {
    element.style.display = "block";
};
export const hideElementByQuery = (query: string) => {
    hideElement(document.querySelector(query) as HTMLElement);
};
export const showElementByQuery = (query: string) => {
    showElement(document.querySelector(query) as HTMLElement);
};

/**
 *Copiar un texto al portapapeles
 *
 * @param {string} text
 */
export const copyTextToClipboard = (text: string): Boolean => {
    let result: boolean;
    const textArea = document.createElement("textarea");

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = "0";
    textArea.style.left = "0";

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = "0";

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        result = (successful);

    } catch (err) {
        result = false;
    }

    document.body.removeChild(textArea);
    return result;
};

/**
 * @return {HTMLElement}
 * @param html
 */
export const htmlToElement = (html: string): HTMLElement => {
    const template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
};
