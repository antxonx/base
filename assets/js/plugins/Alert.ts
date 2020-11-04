import $ from 'jquery';
import 'bootstrap';

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
    private ok: string = '<i class="fa fa-check fa-2x text-success"></i>';
    //private ok: string = '<i class="material-icons-outlined s-2">check_circle</i>'
    /**
     *texte para cancelar
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private cancel: string = '<i class="fa fa-times fa-2x text-danger"></i>';

    /**
     * Saber si llevará botón para cancelar
     *
     * @private
     * @type {boolean}
     * @memberof Modal
     */
    private readonly hasCancel: boolean;

    /**
     * Ondimiss action
     *
     * @private
     * @memberof Modal
     */
    private readonly ondismiss: (status: boolean) => void;

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

    /**
     *Estrutura principal del modal
     *
     * @private
     * @memberof Modal
     */
    private structure = `
    <div class="modal fade2" id="modalId" tabindex="-1" role="dialog" aria-labelledby="modalViewIdLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered alert-dialog" id="modalDialogId" role="document">
            <div class="modal-content p-2 alert-ask">
                
                <div class="h4 text-center mx-auto text-dark font-weight-bold" id="modalBodyId">
                    
                </div>
                <div class="toast-body" id="modalFooter">
                
                </div>
                
            </div>
        </div>
    </div>
    `;

    /**
     * Crear una instancia de Alert
     * @param {boolean} [hasCacnel=false]
     * @param {(status : boolean) => void} [ondismiss=() => { }]
     * @memberof Modal
     */
    public constructor(hasCacnel: boolean = false, ondismiss: (status: boolean) => void = () => {
    }) {
        this.modalId = this.randomId();
        this.hasCancel = hasCacnel;
        this.modalViewIdLabel = this.randomId();
        this.modalDialogId = this.randomId();
        this.modalBodyId = this.randomId();
        this.modalFooter = this.randomId();
        this.ondismiss = ondismiss;
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
                this.ondismiss(this.status);
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
        if (this.hasCancel) {
            document.getElementById(this.modalFooter)!.innerHTML =
                `
                <div class="d-flex justify-content-between w-100">
                <span class="space"></span>
                <button type="button" class="btn btn-lg w-100" data-dismiss="modal">${this.cancel}</button>
                <span class="space"></span>
                <button type="button" id="acceptAlert" class="btn btn-lg w-100" data-dismiss="modal">${this.ok}</button>
                <span class="space"></span>
                </div>
                 `;
        } else {
            document.getElementById(this.modalFooter)!.innerHTML =
                `
                <div class="d-flex justify-content-between w-100">
                <span class="space"></span>
                <span class="space"></span>
                <span class="space"></span>
                <button type="button" id="acceptAlert" class="btn btn-lg w-100" data-dismiss="modal">${this.ok}</button>
                <span class="space"></span>
                <span class="space"></span>
                <span class="space"></span>
                </div>
                `;
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
