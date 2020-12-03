import $ from 'jquery';
import 'bootstrap';

/**
 *Clase para crear modals
 *
 * @export
 * @class Modal
 */
export default class Modal {
    /**
     *Título del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly title: string;
    /**
     *Tamaño del modal
     *
     * @private
     * @type {number}
     * @memberof Modal
     */
    private readonly size: number;
    /**
     *Id del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalId: string;
    /**
     *Id del label del modal
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
     *id del título del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalTitleId: string;
    /**
     *is del body del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly modalBodyId: string;
    /**
     *Elemento modal
     *
     * @private
     * @type {HTMLElement}
     * @memberof Modal
     */
    private modal: HTMLElement;
    /**
     *Loader al cargar datos
     *
     * @private
     * @memberof Modal
     */
    private BIG_LOADER = '<div class="loader"></div>';

    /**
     * llamar al esconder modal
     *
     * @private
     * @memberof Modal
     */
    private readonly onHide: () => void;

    /**
     * Estruxtura principal del modal
     *
     * @private
     * @memberof Modal
     */
    private structure = `<div class="modal fade2" id="modalId" tabindex="-1" role="dialog" aria-labelledby="modalViewIdLabel" aria-hidden="true"><div class="modal-dialog  round" id="modalDialogId" role="document"><div class="modal-content round main"><div class="modal-body"><h5 class="modal-title text-center" id="modalViewIdLabel"><label id="modalTitleId">Vista</label><button type="button" id="closeModal" class="close float-right hide-on-mobile" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></h5><hr class="divide"><div id="modalBodyId"></div><div class="mt-2 text-right"><button type="button" id="closeModal" class="btn btn-danger round w-100 text-center hide-on-desktop" data-dismiss="modal" aria-label="Close">Cerrar</button></div></div></div></div></div>`;

    /**
     *Creates an instance of Modal.
     * @param {string} title
     * @param {number} size
     * @param {() => void} [onHide=() => {}]
     * @memberof Modal
     */
    public constructor(title: string, size: number, onHide: () => void = () => {
    }) {
        this.title = title;
        this.size = size;
        this.onHide = onHide;
        this.modalId = Modal.randomId();
        this.modalViewIdLabel = Modal.randomId();
        this.modalDialogId = Modal.randomId();
        this.modalTitleId = Modal.randomId();
        this.modalBodyId = Modal.randomId();
        this.modal = Modal.htmlToElement("<div></div>");
        this.createModal();
    }

    /**
     *Crear el mdoal
     *
     * @private
     * @memberof Modal
     */
    private createModal() {
        let newTemplate = this.structure.replace("modalId", this.modalId);
        newTemplate = newTemplate.replace("modalViewIdLabel", this.modalViewIdLabel);
        newTemplate = newTemplate.replace("modalDialogId", this.modalDialogId);
        newTemplate = newTemplate.replace("modalTitleId", this.modalTitleId);
        newTemplate = newTemplate.replace("modalBodyId", this.modalBodyId);
        this.modal = Modal.htmlToElement(newTemplate);
        document.body.appendChild(this.modal);
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
     *Establecer el título
     *
     * @private
     * @memberof Modal
     */
    private setTitle() {
        document.getElementById(this.modalTitleId)!.innerHTML = this.title;
    }

    /**
     *Establecer el tamaño
     *
     * @private
     * @memberof Modal
     */
    private setSize() {
        document.getElementById(this.modalDialogId)!.style.width = `${this.size}%`;
    }

    /**
     *Actualizar el body
     *
     * @param {string} content
     * @memberof Modal
     */
    public updateBody(content: string) {
        document.getElementById(this.modalBodyId)!.innerHTML = content;
    }

    /**
     *Colocar un loader en el body
     *
     * @memberof Modal
     */
    public loadingBody() {
        this.updateBody(this.BIG_LOADER);
    }


    /**
     *Mostrar modal
     *
     * @memberof Modal
     */
    public show() {
        this.setTitle();
        this.setSize();
        this.loadingBody();
        $(this.modal).modal("show");
        $(this.modal).on("hidden.bs.modal", () => {
            setTimeout( () => {
                this.modal.setAttribute("style", "display: none !important;")
                this.deleteModal();
                //Verificamos si hay algún modal abierto para mantener la clase `modal-open`
                if (document.getElementsByClassName("modal").length > 0) {
                    $('body').addClass('modal-open');
                }
                //.
                this.onHide();
            }, 200);
        });
        return this;
    }

    /**
     *Mostrar sin eliminar al esconder
     *
     * @memberof Modal
     */
    public showNoDelete() {
        this.setTitle();
        this.setSize();
        this.loadingBody();
        $(this.modal).modal("show");
    }

    /**
     *Destruir modal
     *
     * @private
     * @memberof Modal
     */
    private deleteModal = () => {
        this.modal.parentNode!.removeChild(this.modal);
    };

    /**
     *Esconder modal
     *
     * @memberof Modal
     */
    public hide() {
        $(this.modal).modal("hide");
    }

    /**
     *Generar un id aleatoria
     *
     * @private
     * @returns {string}
     * @memberof Modal
     */
    private static randomId(): string {
        return "_" + Math.floor(Math.random() * 1000000) + 1;
    }

    /**
     *Conseguir el id del modal
     *
     * @returns {string}
     * @memberof Modal
     */
    public getId(): string {
        return this.modalId;
    }
}
