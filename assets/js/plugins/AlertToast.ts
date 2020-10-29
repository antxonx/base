import $ from 'jquery';
import 'bootstrap';

/**
 *Clase para alertas de informe temporales
 *
 * @export
 * @class Toast
 */
export default class Toast {

    /**
     *Tiempo de retraso
     *
     * @static
     * @memberof Toast
     */
    static DELAY_TIME = 2500;

    /**
     * Icono de éxito
     *
     * @static
     * @memberof Toast
     */

    static successIcon = '<i class="fas fa-2x fa-check-circle text-white"></i>';

    /**
     * Icono de error
     *
     * @static
     * @memberof Toast
     */
    static errorIcon = '<i class="fas fa-2x fa-times-circle text-white"></i>';

    /**
     *Estructura principal del toast
     *
     * @static
     * @memberof Toast
     */
    static TOAST_TEMPLATE = `
        <div id="changeMe" class="toast toast-res alert alert-dismissible toast-changClass" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-body row">
            <div class="col-md-2 d-none">toastIconChange</div><div class="col-md-10 row">
            <div class="col-sm-1">toastIcon</div>
            <div class="col-sm-11">toastBodyChange</div>
            </div>
            </div>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
    `;
    /**
     *Ícono de success
     *
     * @static
     * @memberof Toast
     */
    static SUCCESS_CHECK = '<i class="fas fa-check-circle fa-2x"></i>';
    /**
     *Ícono de error
     *
     * @static
     * @memberof Toast
     */
    static ERROR_CHECK = '<i class="fas fa-times-circle fa-2x"></i>';


    /**
     *Muestra una alerta de éxito
     *
     * @static
     * @memberof Toast
     * @param {string} text
     */
    public static success = (text: string) => {
        const ID = Math.floor(Math.random() * 10000000);
        const TOAST_BODY = `
            <label class="h5">
            &nbsp;${text}
            </label>
        `;
        let newTemplate = Toast.TOAST_TEMPLATE.replace("changeMe", `_${ID}`);
        newTemplate = newTemplate.replace("toastIconChange", Toast.SUCCESS_CHECK);
        newTemplate = newTemplate.replace("toastBodyChange", TOAST_BODY);
        newTemplate = newTemplate.replace("changClass", "success");
        newTemplate = newTemplate.replace("toastIcon", Toast.successIcon);
        const NEW_TOAST = Toast.htmlToElement(newTemplate);
        document.getElementById("toastCont")!.appendChild(NEW_TOAST);
        const _T = $(`#_${ID}`);
        _T.toast({
            delay: Toast.DELAY_TIME
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
        const TOAST_BODY = `
            <label class="h5">
            &nbsp;${text}
            </label>
        `;
        let newTemplate = Toast.TOAST_TEMPLATE.replace("changeMe", `_${ID}`);
        newTemplate = newTemplate.replace("toastIconChange", Toast.ERROR_CHECK);
        newTemplate = newTemplate.replace("toastBodyChange", TOAST_BODY);
        newTemplate = newTemplate.replace("changClass", "error");
        newTemplate = newTemplate.replace("toastIcon", Toast.errorIcon);
        const NEW_TOAST = Toast.htmlToElement(newTemplate);
        document.getElementById("toastCont")!.appendChild(NEW_TOAST);
        const _T = $(`#_${ID}`);
        _T.toast({
            delay: Toast.DELAY_TIME
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
