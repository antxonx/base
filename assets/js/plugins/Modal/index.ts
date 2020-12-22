/**
 * Opens a bootstrap modal
 * @packageDocumentation
 * @module Modal
 * @preferred
 */
import $ from 'jquery';
import 'bootstrap';
import {DEFAULT_MODAL_OPTIONS, MODAL_LOADER, ModalIds, ModalOptions} from "./defs";

/**
 * create modals
 *
 * @export
 * @class Modal
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Modal {
    /**
     *modal options
     *
     * @private
     * @type {ModalOptions}
     * @memberof Modal
     */
    private readonly options: ModalOptions;
    /**
     *Id del modal
     *
     * @private
     * @type {string}
     * @memberof Modal
     */
    private readonly id: string;
    /**
     *Elemento modal
     *
     * @private
     * @type {HTMLElement}
     * @memberof Modal
     */
    private modal: HTMLElement;

    /**
     * Estruxtura principal del modal
     *
     * @private
     * @memberof Modal
     */
    private structure = `<div class="modal fade2" id="${ModalIds.MODAL}#id#" tabindex="-1" role="dialog" aria-labelledby="${ModalIds.LABEL}#id#" aria-hidden="true"><div class="modal-dialog round" id="${ModalIds.DIALOG}#id#" role="document"><div class="modal-content round main"><div class="modal-body"><h5 class="modal-title text-center" id="modalLabel_#id#"><label id="${ModalIds.TITLE}#id#">Vista</label><button type="button" class="close float-right hide-on-mobile" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button></h5><hr class="divide"><div id="${ModalIds.BODY}#id#"></div><div class="mt-2 text-right"><button type="button" class="btn btn-danger round w-100 text-center hide-on-desktop" data-dismiss="modal" aria-label="Close">Cerrar</button></div></div></div></div></div>`;

    /**
     *Creates an instance of Modal.
     * @memberof Modal
     * @param options
     */
    public constructor(options: ModalOptions) {
        this.options = {...DEFAULT_MODAL_OPTIONS, ...options};
        this.id = Modal.randomId();
        this.modal = Modal.htmlToElement("<div></div>");
        //this.createModal();
    }

    /**
     *Crear el mdoal
     *
     * @private
     * @memberof Modal
     */
    private createModal() {
        let newTemplate = this.structure.replace(/#id#/g, this.id);
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
        document.getElementById(ModalIds.TITLE + this.id)!.innerHTML = this.options.title!;
    }

    /**
     *Establecer el tamaño
     *
     * @private
     * @memberof Modal
     */
    private setSize() {
        document.getElementById(ModalIds.DIALOG + this.id)!.style.width = `${this.options.size}%`;
    }

    /**
     * update body
     *
     * @param {string} content
     * @memberof Modal
     */
    public updateBody(content: string) {
        document.getElementById(ModalIds.BODY + this.id)!.innerHTML = content;
    }

    /**
     * get body
     *
     * @memberof Modal
     */
    public getBody() {
        return document.getElementById(ModalIds.BODY + this.id)!.innerHTML;
    }

    /**
     *Colocar un loader en el body
     *
     * @memberof Modal
     */
    public loadingBody() {
        this.updateBody(MODAL_LOADER);
    }


    /**
     *Mostrar modal
     *
     * @memberof Modal
     */
    public show(loading = true) {
        //console.log(this);
        this.createModal();
        this.setTitle();
        this.setSize();
        if(loading)
            this.loadingBody();
        $(this.modal).modal("show");
        $(this.modal).on("hidden.bs.modal", () => {
            setTimeout(() => {
                this.modal.setAttribute("style", "display: none !important;");
                this.deleteModal();
                //Verificamos si hay algún modal abierto para mantener la clase `modal-open`
                if (document.getElementsByClassName("modal").length > 0) {
                    $('body').addClass('modal-open');
                }
                //.
                this.options.onHide!();
            }, 200);
        });
        return this;
    }

    /**
     *Mostrar sin eliminar al esconder
     *
     * @memberof Modal
     */
    public showNoDelete(loading = true) {
        this.setTitle();
        this.setSize();
        if(loading)
            this.loadingBody();
        $(this.modal).modal("show");
        $(this.modal).on("hidden.bs.modal", () => {
            setTimeout(() => {
                this.modal.setAttribute("style", "display: none !important;");
                //Verificamos si hay algún modal abierto para mantener la clase `modal-open`
                if (document.getElementsByClassName("modal").length > 0) {
                    $('body').addClass('modal-open');
                }
                //.
                this.options.onHide!();
            }, 200);
        });
        return this;
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
        return this.id;
    }
}
