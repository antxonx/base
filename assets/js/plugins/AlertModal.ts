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
    private modalId: string;
    /**
     *idLael del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private modalViewIdLabel: string;
    /**
     *id del dialog del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private modalDialogId: string;
    /**
     *Id del body del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private modalBodyId: string;
    /**
     * Id del footer del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private modalFooter: string;
    /**
     * Elemento del modal
     *
     * @private
     * @type {HTMLElement}
     * @memberof Modal
     */
    private modal: HTMLElement;
    /**
     * Acción a realizar una vez aceptada
     *
     * @private
     * @memberof Modal
     */
    private onAccept: (type: number, id?: number) => Promise<boolean>;
    /**
     * Tipo de solicitud
     *
     * @private
     * @type {number}
     * @memberof Modal
     */
    private type: number;
    /**
     * Texto para aceptar
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private ok: string;
    /**
     *texte para cancelar
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private cancel: string;
    /**
     * Contenido para pasar al aceptar
     *
     * @private
     * @type {*}
     * @memberof Modal
     */
    private id: any;
    /**
     * Decidir si responder con la alerta o cerrar
     *
     * @private
     * @type {boolean}
     * @memberof Modal
     */
    private endStatus: boolean;

    private ondismiss: () => void;

    /**
     *Estrutura principal del modal
     *
     * @private
     * @memberof Modal
     */
    private structure = `
    <div class="modal fade-scale" id="modalId" tabindex="-1" role="dialog" aria-labelledby="modalViewIdLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered alert-dialog" id="modalDialogId" role="document">
            <div class="modal-content alert">
                <div class="modal-body h3" id="modalBodyId">
                </div>
                <div class="modal-footer border-0 text-center" id="modalFooter">
                </div>
            </div>
        </div>
    </div>
    `;
    /**
     * Crear una instancia de AlertModal
     * @param {string} ok
     * @param {string} [cancel=""]
     * @param {number} [type=0]
     * @param {boolean} [onAccept=async (type : number, id? : any) => true]
     * @param {*} [id]
     * @param {boolean} [endStatus=true]
     * @memberof Modal
     */
    public constructor (ok: string, cancel: string = "", type = 0, onAccept = async (type: number, id?: any) => true, id?: any, endStatus = true, ondismiss: () => void = () => { }) {
        this.modalId = this.randomId();
        this.onAccept = onAccept;
        this.type = type;
        this.ok = ok;
        this.endStatus = endStatus;
        this.cancel = cancel;
        this.modalViewIdLabel = this.randomId();
        this.modalDialogId = this.randomId();
        this.modalBodyId = this.randomId();
        this.modalFooter = this.randomId();
        this.id = id;
        this.ondismiss = ondismiss;
        this.modal = this.htmlToElement("<div></div>");
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
        this.modal = this.htmlToElement(newTemplate);
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
    private htmlToElement(html: string): HTMLElement {
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
     * @memberof Modal
     */
    public show(dismiss = true) {
        this.setSize();
        $(this.modal).modal("show");
        $(this.modal).on("hidden.bs.modal", () => {
            this.deleteModal();
            this.ondismiss();
            //Verificamos si hay algún modal abierto para mantener la clase `modal-open`
            if (document.getElementsByClassName("modal").length > 0) {
                $('body').addClass('modal-open');
            }
            //.
        });
        document.getElementById("acceptAlert")!.addEventListener("click", async () => {
            let res: boolean;
            document.getElementById(this.modalFooter)!.innerHTML = '<div class="w-100 d-flex justify-content-center"><div class="spinner"></div></div>';
            if (this.id) {
                res = await this.onAccept(this.type, this.id);
            } else {
                res = await this.onAccept(this.type);
            }
            if (this.endStatus) {
                if (res) {
                    this.updateBody(`
                    <div class="text-center text-success">
                        ¡Listo!
                    </div>
                    `);
                } else {
                    this.updateBody(`
                    <div class="text-center text-danger">
                        ¡Ocurrió un error!
                    </div>
                    `);
                }
                this.cancel = "";
                this.build(dismiss);
            } else {
                this.hide();
            }
        });
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
     * @param {boolean} [dismiss=false]
     * @memberof Modal
     */
    private build(dismiss: boolean = false) {
        let acDis, acId, acceptMsg;
        if (dismiss) {
            acDis = 'data-dismiss="modal"';
            acId = 'acceptNoTrigger';
            acceptMsg = 'Aceptar';
        } else {
            acDis = '';
            acId = "acceptAlert";
            acceptMsg = this.ok;
        }
        if (this.cancel != "") {
            document.getElementById(this.modalFooter)!.innerHTML =
                `
                <div class="d-flex justify-content-around w-100 alert-content">
                <button type="button" id="acceptAlert" class="btn btn-lg w-100 font-weight-bold">${this.ok}</button>
                <button type="button" class="btn btn-lg w-100 text-danger font-weight-bold" data-dismiss="modal">${this.cancel}</button>
                </div>
                 `;
        } else {
            document.getElementById(this.modalFooter)!.innerHTML =
                `
                <div class="w-100 alert-content">
                <button type="button" id="${acId}" class="btn btn-lg w-100 font-weight-bold" ${acDis}>${acceptMsg}</button>
                </div>
                `;
        }
    }

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