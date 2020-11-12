import $ from 'jquery';
import 'bootstrap';

export interface AlertOptions {
    hasCancel?: boolean;
    onDismiss?: (status: boolean) => void;
    type?: ('info' | 'warning' | 'danger' | 'success');
    typeText?: string
}

const DEFAULT_ALERT_OPTIONS : AlertOptions = {
    hasCancel: true,
    onDismiss: () => {},
    typeText: '',
}

/**
 *Clase para crear alertas con respeustas
 *
 * @export
 * @class Modal
 */
export default class Modal {
    /**
     *Tamaño del modal
     *
     * @private
     * @memberof Modal
     */
    private size = 40;
    /**
     *Id del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalId: string;
    /**
     *idLael del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalViewIdLabel: string;
    /**
     *id del dialog del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalDialogId: string;
    /**
     *Id del body del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalBodyId: string;
    /**
     *Id del header del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalHeaderId: string;
    /**
     * Id del footer del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalFooter: string;
    /**
     * Elemento del modal
     *
     * @private
     * @type {HTMLElement}
     * @memberof Modal
     */
    private modal: HTMLElement;

    /**
     * Texto para aceptar
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private ok: string = 'Aceptar';

    /**
     *texte para cancelar
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private cancel: string = 'Cancelar';


    /**
     * Opciones
     *
     * @private
     * @type {AlertOptions}
     * @memberOf Modal
     */
    private options : AlertOptions;

    /**
     * Estado de la petición
     *
     * @private
     * @type {boolean}
     * @memberof Modal
     */
    private status: boolean;

    /**
     * Consición de espera del usuario
     *
     * @private
     * @type {boolean}
     * @memberof Modal
     */
    private next: boolean;

    private readonly INFO_ALERT = `<i class="fas fa-info-circle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly WARNING_ALERT = `<i class="fas fa-exclamation-triangle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly DANGER_ALERT = `<i class="fas fa-exclamation-triangle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly SUCCESS_ALERT = `<i class="fas fa-check-circle fa-2x"></i> <span class="h5 font-weight-bold">#text#</span>`;
    private readonly NO_ICON_ALERT = `<i class=""></i> <span class="h5 font-weight-bold">#text#</span>`;

    /**
     *Estrutura principal del modal
     *
     * @private
     * @memberof Modal
     */
    private structure = `
    <div class="modal fade2" id="modalId" tabindex="-1" role="dialog" aria-labelledby="modalViewIdLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" id="modalDialogId" role="document">
            <div class="modal-content p-0 round shadow-lg">
                <div class="modal-header" id="modalHeaderId">
                
                </div>
                <div class="h4 text-center mx-auto text-dark font-weight-bold mt-5 mb-5" id="modalBodyId">
                    
                </div>
                <div class="toast-body p-0" id="modalFooter">
                        
                </div>
            </div>
        </div>
    </div>
    `;

    /**
     * Crear una instancia de Alert
     * @memberof Modal
     * @param options
     */
    public constructor(options: AlertOptions = DEFAULT_ALERT_OPTIONS) {
        this.modalId = this.randomId();
        this.options = {...DEFAULT_ALERT_OPTIONS, ...options};
        this.modalViewIdLabel = this.randomId();
        this.modalDialogId = this.randomId();
        this.modalBodyId = this.randomId();
        this.modalHeaderId = this.randomId();
        this.modalFooter = this.randomId();
        this.status = false;
        this.next = false;
        this.modal = Modal.htmlToElement("<div></div>");
        this.createModal();
    }

    /**
     * Crear el modal
     *
     * @private
     * @memberof Modal
     */
    private createModal() {
        let newTemplate = this.structure.replace("modalId", this.modalId);
        newTemplate = newTemplate.replace("modalViewIdLabel", this.modalViewIdLabel);
        newTemplate = newTemplate.replace("modalDialogId", this.modalDialogId);
        newTemplate = newTemplate.replace("modalBodyId", this.modalBodyId);
        newTemplate = newTemplate.replace("modalHeaderId", this.modalHeaderId);
        newTemplate = newTemplate.replace("modalFooter", this.modalFooter);
        this.modal = Modal.htmlToElement(newTemplate);
        document.body.appendChild(this.modal);
        this.build();
    }

    /**
     * Convertir un string a un elemento de HTML
     *
     * @private
     * @param {string} html
     * @returns {HTMLElement}
     * @memberof Modal
     */
    private static htmlToElement(html: string): HTMLElement {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild as HTMLElement;
    }

    /**
     *Establecer tamaño del modal
     *
     * @private
     * @memberof Modal
     */
    private setSize() {
        document.getElementById(this.modalDialogId)!.style.width = `${this.size}%`;
    }

    /**
     *Actualizar el contenido
     *
     * @param {string} content
     * @returns
     * @memberof Modal
     */
    public updateBody(content: string) {
        document.getElementById(this.modalBodyId)!.innerHTML = content;
        return this;
    }

    /**
     * Mostrar la alerta
     *
     * @param {boolean} [dismiss=true]
     * @returns {Promise<boolean>}
     * @memberof Modal
     */
    public async show(dismiss: boolean = true): Promise<boolean> {
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
     * Esperar input de usuario
     *
     * @memberof Modal
     */
    public async waitForInput() {
        while (!this.next) await this.timeout(50);
        this.next = false;
    }

    /**
     * Mostrar sin destruir al ocultar
     *
     * @memberof Modal
     */
    public showNoDelete() {
        this.setSize();
        $(this.modal).modal("show");
    }

    /**
     * destruir modal
     *
     * @private
     * @memberof Modal
     */
    private deleteModal = () => {
        this.modal.parentNode!.removeChild(this.modal);
    };

    /**
     * Esconder modal
     *
     * @memberof Modal
     */
    public hide() {
        $(this.modal).modal("hide");
    }

    /**
     * Construir el footer del modal
     *
     * @private
     * @memberof Modal
     */
    private build() {
        let icon : string;
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
     * Generar un ID aleatorio
     *
     * @returns {string}
     * @memberof Modal
     */
    randomId(): string {
        return "_" + Math.floor(Math.random() * 1000000) + 1;
    }
}
