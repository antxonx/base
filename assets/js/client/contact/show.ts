/**
* @packageDocumentation
* @module Client/Contact
*/

import { DEFAULT_SHOW_OPTIONS, showOptions } from "@scripts/client/contact/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import Toast from "@plugins/AlertToast";
import { evaluateInputs, hideElement, showElement } from "@plugins/Required";
import Alert from "@plugins/Alert";
import { deleteElement, disableRow } from "@plugins/DeleteElement";
import '@scripts/jquery';

/**
 * Opens a modal with the contact info
 *
 * @export
 * @class Show
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Show {

    protected options: showOptions;

    protected modal: Modal;

    protected control: boolean;

    public constructor (options: showOptions) {
        this.options = { ...DEFAULT_SHOW_OPTIONS, ...options };
        this.control = true;
        if (this.options.id === 0) {
            throw new Error("No se ha podido obtener información del cliente");
        }
        this.modal = new Modal({
            title: "Contacto",
            size: 50,
            onHide: this.options.callback
        });
    }

    public load = () => {
        if (this.control) {
            this.control = false;
            this.modal.show();
            this.update();
        }
        document.getElementById("contact-edit-active")?.addEventListener("click", this.edit);
        document.getElementById("contact-phone-extra-form")?.addEventListener("submit", this.addExtraPhone);
        document.getElementById("contact-email-extra-form")?.addEventListener("submit", this.addExtraEmail);
        Array.from(document.getElementsByClassName("trash-phone")).forEach(el => el.addEventListener('click', this.deletePhone));
        Array.from(document.getElementsByClassName("trash-email")).forEach(el => el.addEventListener('click', this.deleteEmail));
    };

    private update = async () => {
        try {
            const res = await Axios.get(
                Router.generate(ROUTES.client.contact.view.show, { 'id': this.options.id.toString() })
            );
            this.modal.updateBody(res.data);
            $('.editable-field').editable({
                success: (_res: string) => {
                    Toast.success(_res);
                },
                error: (_err: any) => {
                    console.error(_err.responseText);
                    Toast.error(_err.responseText);
                },
                disabled: true
            });
            this.load();
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    private edit = (e: Event) => {
        const BTN = (e.currentTarget as HTMLElement);
        if (!!(+BTN.getAttribute("active")!)) {
            BTN.setAttribute("active", "0");
            BTN.classList.remove("btn-danger");
            BTN.classList.add("btn-warning");
            BTN.innerHTML = "Editar Contacto";
            Array.from(document.getElementsByClassName("trash-email")).forEach(el => hideElement(el as HTMLElement));
            Array.from(document.getElementsByClassName("trash-phone")).forEach(el => hideElement(el as HTMLElement));
            Array.from(document.getElementsByClassName("trash-contact")).forEach(el => hideElement(el as HTMLElement));
            Array.from(document.getElementsByClassName("plus-btn")).forEach(el => hideElement(el as HTMLElement));
            $('#email-extra-container').collapse('hide');
            $('#phone-extra-container').collapse('hide');
        } else {
            BTN.setAttribute("active", "1");
            BTN.classList.remove("btn-warning");
            BTN.classList.add("btn-danger");
            BTN.innerHTML = "Cancelar";
            Array.from(document.getElementsByClassName("trash-email")).forEach(el => showElement(el as HTMLElement));
            Array.from(document.getElementsByClassName("trash-phone")).forEach(el => showElement(el as HTMLElement));
            Array.from(document.getElementsByClassName("trash-contact")).forEach(el => showElement(el as HTMLElement));
            Array.from(document.getElementsByClassName("plus-btn")).forEach(el => showElement(el as HTMLElement));
        }
        $('.editable-field').editable('toggleDisabled');
    };

    private addExtraPhone = async (e: Event) => {
        e.preventDefault();
        if (evaluateInputs([ document.getElementById("phone") as HTMLInputElement ], 1, false)) {
            const BTN = document.getElementById("submit-phone-extra-btn")!;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;

            try {
                const res = await Axios.post(
                    Router.generate(ROUTES.client.contact.extra.api.add, { 'id': this.options.id.toString() }),
                    {
                        type: 2,
                        level: (document.getElementById("phoneType") as HTMLInputElement).value,
                        value: (document.getElementById("phone") as HTMLInputElement).value,
                    }
                );
                Toast.success(res.data);
                this.update();
            } catch (err) {
                const e = err.response ? err.response.data : err;
                console.error(e);
                Toast.error(e);
                BTN.innerHTML = BEF;
            }
        }
    };

    private addExtraEmail = async (e: Event) => {
        e.preventDefault();
        if (evaluateInputs([ document.getElementById("email") as HTMLInputElement ], 1, false)) {
            const BTN = document.getElementById("submit-email-extra-btn")!;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            try {
                const res = await Axios.post(
                    Router.generate(ROUTES.client.contact.extra.api.add, { 'id': this.options.id.toString() }),
                    {
                        type: 1,
                        level: 1,
                        value: (document.getElementById("email") as HTMLInputElement).value,
                    }
                );
                Toast.success(res.data);
                this.update();
            } catch (err) {
                const e = err.response ? err.response.data : err;
                console.error(e);
                Toast.error(e);
                BTN.innerHTML = BEF;
            }
        }
    };

    private deletePhone = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".phone-container") as HTMLElement;
        const ID = +ELEMENT.getAttribute("phone-id")!;
        const PHONE = ELEMENT.getAttribute("phone-phone")!;
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Alerta'
        });
        const res = await ALERT.updateBody(`¿Eliminar el número <b>${PHONE}</b>?`).show();
        if (res) {
            disableRow(ELEMENT);
            try {
                const res = await Axios.delete(
                    Router.generate(ROUTES.client.contact.extra.api.delete, { 'id': ID.toString() })
                );
                deleteElement(ELEMENT);
                Toast.success(res.data);
            } catch (err) {
                console.error(err.response.data);
            }
        }
    };

    private deleteEmail = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".email-container") as HTMLElement;
        const ID = +ELEMENT.getAttribute("email-id")!;
        const NAME = ELEMENT.getAttribute("email-email")!;
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Alerta'
        });
        const res = await ALERT.updateBody(`¿Eliminar el correo <b>${NAME}</b>?`).show();
        if (res) {
            disableRow(ELEMENT);
            try {
                const res = await Axios.delete(
                    Router.generate(ROUTES.client.contact.extra.api.delete, { 'id': ID.toString() })
                );
                deleteElement(ELEMENT);
                Toast.success(res.data);
            } catch (err) {
                console.error(err.response ? err.response.data : err);
            }
        }
    };
}
