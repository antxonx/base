/**
 * Shows alert to confirm or accept
 * @packageDocumentation
 * @module Alert
 * @preferred
 */
import $ from 'jquery';
import 'bootstrap';
import {AlertOptions, DEFAULT_ALERT_OPTIONS} from "./defs";

/**
 * Clase para crear alertas con respeustas
 *
 * @export
 * @class Alert
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Alert {
    /**
     * Modal size
     *
     * @private
     * @memberof Alert
     */
    private size = 40;
    /**
     * Modal id
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private readonly modalId: string;
    /**
     * idLael
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private readonly modalViewIdLabel: string;
    /**
     * dialog id
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private readonly modalDialogId: string;
    /**
     * body id
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private readonly modalBodyId: string;
    /**
     * header id
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private readonly modalHeaderId: string;
    /**
     * footer id
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private readonly modalFooter: string;
    /**
     * Elemento del modal
     *
     * @private
     * @type {HTMLElement}
     * @memberof Alert
     */
    private modal: HTMLElement;

    /**
     * ok text
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private ok: string = 'Aceptar';

    /**
     * cancel text
     *
     * @private
     * @type {string}
     * @memberof Alert
     */
    private cancel: string = 'Cancelar';


    /**
     * options
     *
     * @private
     * @type {AlertOptions}
     * @memberOf Alert
     */
    private options: AlertOptions;

    /**
     * status
     *
     * @private
     * @type {boolean}
     * @memberof Alert
     */
    private status: boolean;

    /**
     * next
     *
     * @private
     * @type {boolean}
     * @memberof Alert
     */
    private next: boolean;

    private readonly INFO_ALERT = `<i class="fas fa-info-circle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly WARNING_ALERT = `<i class="fas fa-exclamation-triangle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly DANGER_ALERT = `<i class="fas fa-exclamation-triangle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly SUCCESS_ALERT = `<i class="fas fa-check-circle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly NO_ICON_ALERT = `<i class=""></i> <span class="h5 font-weight-bold">#text#</span>`;

    /**
     * structure
     *
     * @private
     * @memberof Modal
     */
    private structure = `<div class="modal fade2" id="modalId" tabindex="-1" role="dialog" aria-labelledby="modalViewIdLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered" id="modalDialogId" role="document"><div class="modal-content p-0 round shadow-lg"><div class="modal-header" id="modalHeaderId"></div><div class="h4 text-center mx-auto text-dark font-weight-bold mt-5 mb-5" id="modalBodyId"></div><div class="toast-body p-0" id="modalFooter"></div></div></div></div>`;

    /**
     * Crear una instancia de Alert
     * @memberof Alert
     * @param options
     */
    public constructor(options: AlertOptions = DEFAULT_ALERT_OPTIONS) {
        this.modalId = Alert.randomId();
        this.options = {...DEFAULT_ALERT_OPTIONS, ...options};
        this.modalViewIdLabel = Alert.randomId();
        this.modalDialogId = Alert.randomId();
        this.modalBodyId = Alert.randomId();
        this.modalHeaderId = Alert.randomId();
        this.modalFooter = Alert.randomId();
        this.status = false;
        this.next = false;
        this.modal = Alert.htmlToElement("<div></div>");
        this.createModal();
    }

    /**
     * Create modal
     *
     * @private
     * @memberof Alert
     */
    private createModal() {
        let newTemplate = this.structure.replace("modalId", this.modalId);
        newTemplate = newTemplate.replace("modalViewIdLabel", this.modalViewIdLabel);
        newTemplate = newTemplate.replace("modalDialogId", this.modalDialogId);
        newTemplate = newTemplate.replace("modalBodyId", this.modalBodyId);
        newTemplate = newTemplate.replace("modalHeaderId", this.modalHeaderId);
        newTemplate = newTemplate.replace("modalFooter", this.modalFooter);
        this.modal = Alert.htmlToElement(newTemplate);
        document.body.appendChild(this.modal);
        this.build();
    }

    /**
     * html to HTMLElement
     *
     * @private
     * @param {string} html
     * @returns {HTMLElement}
     * @memberof Alert
     */
    private static htmlToElement(html: string): HTMLElement {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild as HTMLElement;
    }

    /**
     * set size
     *
     * @private
     * @memberof Alert
     */
    private setSize() {
        document.getElementById(this.modalDialogId)!.style.width = `${this.size}%`;
    }

    /**
     * update body
     *
     * @param {string} content
     * @returns
     * @memberof Alert
     */
    public updateBody(content: string) {
        document.getElementById(this.modalBodyId)!.innerHTML = content;
        return this;
    }

    /**
     * show alert
     *
     * @param {boolean} [dismiss=true]
     * @returns {Promise<boolean>}
     * @memberof Alert
     */
    public async show(): Promise<boolean> {
        this.setSize();
        $(this.modal).modal("show");
        $(this.modal).on("hidden.bs.modal", () => {
            setTimeout(() => {
                this.next = true;
                this.deleteModal();
                this.options.onDismiss!(this.status);
                //Verificamos si hay algún modal abierto para mantener la clase `modal-open`
                if (document.getElementsByClassName("modal").length > 0) {
                    $('body').addClass('modal-open');
                }
                //.
            }, 200);
        });
        document.getElementById("acceptAlert")!.addEventListener("click", () => {
            this.next = true;
            this.status = true;
        });
        await this.waitForInput();
        return this.status;
    }

    /**
     * wait for user input
     *
     * @memberof Alert
     */
    public async waitForInput() {
        while (!this.next) await this.timeout(50);
        this.next = false;
    }

    /**
     * show but don't destroy on hide
     *
     * @memberof Alert
     */
    public showNoDelete() {
        this.setSize();
        $(this.modal).modal("show");
    }

    /**
     * destroy modal
     *
     * @private
     * @memberof Alert
     */
    private deleteModal = () => {
        this.modal.parentNode!.removeChild(this.modal);
    };

    /**
     * hide modal
     *
     * @memberof Alert
     */
    public hide() {
        $(this.modal).modal("hide");
    }

    /**
     * build
     *
     * @private
     * @memberof Alert
     */
    private build() {
        let icon: string;
        switch (this.options.type) {
            case 'info':
                icon = this.INFO_ALERT;
                break;
            case 'warning':
                icon = this.WARNING_ALERT;
                break;
            case 'danger':
                icon = this.DANGER_ALERT;
                break;
            case 'success':
                icon = this.SUCCESS_ALERT;
                break;
            default:
                icon = this.NO_ICON_ALERT;
                break;
        }
        document.getElementById(this.modalHeaderId)!.innerHTML = icon.replace('#text#', this.options.typeText!);
        document.getElementById(this.modalHeaderId)!.classList.add(`text-${this.options.type}`);

        if (this.options.hasCancel) {
            document.getElementById(this.modalFooter)!.innerHTML =
                `
                <div class="d-flex justify-content-between w-100">
                <button type="button" class="btn btn-lg btn-light p-3 no-round w-100"
                data-dismiss="modal"
                style="
                border-bottom-left-radius: 1.25rem !important;
                ">
                <b>${this.cancel}</b></button>
                <button type="button" id="acceptAlert"
                class="btn btn-lg btn-light p-3 no-round w-100" data-dismiss="modal"
                style="
                border-bottom-right-radius: 1.25rem !important;
                "><b>${this.ok}</b></button>
                </div>
                 `.trim();
        } else {
            document.getElementById(this.modalFooter)!.innerHTML =
                `
                <div class="text-center">
                <button
                type="button"
                id="acceptAlert"
                class="btn btn-lg btn-light p-3 no-round w-100"
                data-dismiss="modal"
                style="
                border-bottom-right-radius: 1.25rem !important;
                border-bottom-left-radius: 1.25rem !important
                ">
                <b>
                 ${this.ok}
                </b>
                </button>
                </div>
                `.trim();
        }
    }

    // this is an async timeout util
    private timeout = async (ms: number) => new Promise(res => setTimeout(res, ms));

    /**
     * random id
     *
     * @returns {string}
     * @memberof Alert
     */
    public static randomId(): string {
        return "_" + Math.floor(Math.random() * 1000000) + 1;
    }
}
