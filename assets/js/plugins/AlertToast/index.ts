/**
 * Shows an alert toast for success or error actions
 * @packageDocumentation
 * @module AlertToast
 * @preferred
 */
import $ from 'jquery';
import 'bootstrap';

/**
 * Shows an alert toast for success or error actions
 *
 * @export
 * @class Toast
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Toast {

    /**
     *Tiempo de retraso
     *
     * @static
     * @memberof Toast
     */
    static DELAY_TIME = 1500;

    /**
     * Icono de éxito
     *
     * @static
     * @memberof Toast
     */

    static successIcon = '<i class="fas fa-check-circle text-dark"></i>';

    /**
     * Icono de error
     *
     * @static
     * @memberof Toast
     */
    static errorIcon = '<i class="fas fa-times-circle text-dark"></i>';

    /**
     *Estructura principal del toast
     *
     * @static
     * @memberof Toast
     */
    static TOAST_TEMPLATE = `<div class="toast toast-changClass" id="changeMe" style="min-width: 300px;" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><strong class="mr-auto text-dark">toastIcon toastTitle</strong><button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body"><div><b>toastBodyChange</b></div></div></div>`

    /**
     *Muestra una alerta de éxito
     *
     * @static
     * @memberof Toast
     * @param {string} text
     */
    public static success = (text: string) => {
        const ID = Math.floor(Math.random() * 10000000);
        let newTemplate = Toast.TOAST_TEMPLATE.replace("changeMe", `_${ID}`);
        newTemplate = newTemplate.replace("toastTitle", "Bien");
        newTemplate = newTemplate.replace("toastBodyChange", text);
        newTemplate = newTemplate.replace("changClass", "success");
        newTemplate = newTemplate.replace("toastIcon", Toast.successIcon);
        const NEW_TOAST = Toast.htmlToElement(newTemplate);
        document.getElementById("toastCont")!.appendChild(NEW_TOAST);
        const _T = $(`#_${ID}`);
        _T.toast({
            delay: Toast.DELAY_TIME,
            autohide: true,
        });
        _T.toast('show');
        _T.on('hidden.bs.toast', () => {
            $(`#_${ID}`).remove();
        });
    };

    /**
     *Muestra una alerta de error
     *
     * @static
     * @memberof Toast
     * @param {string} text
     */
    public static error = (text: string) => {
        const ID = Math.floor(Math.random() * 10000000);
        let newTemplate = Toast.TOAST_TEMPLATE.replace("changeMe", `_${ID}`);
        newTemplate = newTemplate.replace("toastTitle", "Error");
        newTemplate = newTemplate.replace("toastBodyChange", text);
        newTemplate = newTemplate.replace("changClass", "error");
        newTemplate = newTemplate.replace("toastIcon", Toast.errorIcon);
        const NEW_TOAST = Toast.htmlToElement(newTemplate);
        document.getElementById("toastCont")!.appendChild(NEW_TOAST);
        const _T = $(`#_${ID}`);
        _T.toast({
            delay: Toast.DELAY_TIME * 3,
            autohide: true,
        });
        _T.toast('show');
        _T.on('hidden.bs.toast', () => {
            $(`#_${ID}`).remove();
        });
    };

    /**
     * Convertir un string a un elemento de HTML
     * @private
     * @static
     * @memberof Toast
     * @param {string} html
     * @returns {HTMLElement}
     */
    private static htmlToElement = (html: string): HTMLElement => {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild as HTMLElement;
    };
}
