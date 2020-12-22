/**
* Validate inputs and other utilities
* @packageDocumentation
* @module Required
* @preferred
*/

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

declare global {
    interface Window {
        opera:any;
    }
}

export const isMobile = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};
