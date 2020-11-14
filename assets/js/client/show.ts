import $ from 'jquery';
import Modal from "@scripts/plugins/Modal";
import Alert from '@scripts/plugins/Alert';
import Axios from "axios";
import {ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import {openAddressModal} from './addAddress';
import {evaluateInputs, hideElement, showElement} from '@scripts/plugins/Required';
import {openContactModal} from './contact/addContact';
import {showContact} from './contact/show';
import {deleteElement, disableRow} from '@scripts/plugins/DeleteElement';

let MODAL: Modal;
let ID: number;
let CALLBACK: () => void = () => {
};

/**
 * Mostrar el modal del cliente
 *
 * @param {number} id
 * @param callback
 */
export const showClient = (id: number, callback: () => void = CALLBACK) => {
    CALLBACK = callback;
    ID = id;
    MODAL = (new Modal(`Cliente`, 90)).show();
    loadClient();
};

const showClientLocal = () => {
    MODAL = (new Modal(`Cliente`, 90)).show();
    loadClient();
};

/**
 * Cargar vista del cliente
 *
 */
const loadClient = (loading = true) => {
    if (loading)
        MODAL.loadingBody();
    Axios.get(ROUTES.client.view.show.replace('0', ID.toString()))
        .then(res => {
            MODAL.updateBody(res.data);
            $('.editable-field').editable({
                success: onSuccess,
                error: onError,
                disabled: true
            });

            /* --------------------------------- Eventos -------------------------------- */
            //Editar
            document.getElementById("client-edit-active")!.addEventListener("click", toggleEdit);
            //.
            //Dirección
            document.getElementById("address-add")?.addEventListener("click", addAddressAction);
            //.
            //Contactos)
            document.getElementById("contact-add")?.addEventListener("click", addContactAction);
            [...document.getElementsByClassName("contact-delete")].forEach(el => el.addEventListener('click', deleteContactAction));
            [...document.getElementsByClassName("contact-show")].forEach(el => el.addEventListener('click', showContactAction));
            //.
            //Datos extra
            document.getElementById("client-phone-extra-form")!.addEventListener("submit", addExtraPhone);
            document.getElementById("client-email-extra-form")!.addEventListener("submit", addExtraEmail);
            [...document.getElementsByClassName("trash-phone")].forEach(el => el.addEventListener('click', deletePhone));
            [...document.getElementsByClassName("trash-email")].forEach(el => el.addEventListener('click', deleteEmail));
            //.

            /* ------------------------------------ . ----------------------------------- */

        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
};

/**
 * Editar elementos
 *
 * @param {Event} e
 */
const toggleEdit = (e: Event) => {
    const BTN = (e.currentTarget as HTMLElement);
    if (!!(+BTN.getAttribute("active")!)) {
        BTN.setAttribute("active", "0");
        BTN.classList.remove("btn-danger");
        BTN.classList.add("btn-warning");
        BTN.innerHTML = "Editar Cliente";
        [...document.getElementsByClassName("trash-email")].forEach(el => hideElement(el as HTMLElement));
        [...document.getElementsByClassName("trash-phone")].forEach(el => hideElement(el as HTMLElement));
        [...document.getElementsByClassName("trash-contact")].forEach(el => hideElement(el as HTMLElement));
        [...document.getElementsByClassName("plus-btn")].forEach(el => hideElement(el as HTMLElement));
        $('#email-extra-container').collapse('hide');
        $('#phone-extra-container').collapse('hide');
    } else {
        BTN.setAttribute("active", "1");
        BTN.classList.remove("btn-warning");
        BTN.classList.add("btn-danger");
        BTN.innerHTML = "Cancelar";
        [...document.getElementsByClassName("trash-email")].forEach(el => showElement(el as HTMLElement));
        [...document.getElementsByClassName("trash-phone")].forEach(el => showElement(el as HTMLElement));
        [...document.getElementsByClassName("trash-contact")].forEach(el => showElement(el as HTMLElement));
        [...document.getElementsByClassName("plus-btn")].forEach(el => showElement(el as HTMLElement));
    }
    $('.editable-field').editable('toggleDisabled');
};

/**
 * Abrir formulario de dirección
 *
 * @param {Event} e
 */
const addAddressAction = (e: Event) => {
    MODAL.hide();
    openAddressModal(ID, showClientLocal);
};

/**
 * Abrir formulario de dirección
 *
 * @param {Event} e
 */
const addContactAction = (e: Event) => {
    MODAL.hide();
    openContactModal(ID, showClientLocal);
};

/**
 * Sí se pudo editar el cliente
 *
 * @param {*} res
 */
const onSuccess = (res: any) => {
    Toast.success(res);
    CALLBACK();
};

/**
 * No se pudo editar el cliente
 *
 * @param {*} err
 */
const onError = (err: any) => {
    console.error(err.responseText);
    Toast.error(err.responseText);
};

/**
 * Agregar teléfono extra
 *
 * @param {Event} e
 */
const addExtraPhone = (e: Event) => {
    e.preventDefault();
    if (evaluateInputs([document.getElementById("phone") as HTMLInputElement], 1, false)) {
        const BTN = document.getElementById("submit-phone-extra-btn")!;
        const BEF = BTN.innerHTML;
        BTN.innerHTML = SPINNER_LOADER;
        Axios.post(ROUTES.client.api.addExtra.replace("0", ID.toString()), {
            type: 2,
            level: (document.getElementById("phoneType") as HTMLInputElement).value,
            value: (document.getElementById("phone") as HTMLInputElement).value,
        })
            .then(res => {
                Toast.success(res.data);
                loadClient();
            })
            .catch(err => {
                Toast.error(err.response.data);
                console.error(err.response.data);
                BTN.innerHTML = BEF;
            });
    }
};

/**
 * Agregar teléfono extra
 *
 * @param {Event} e
 */
const addExtraEmail = (e: Event) => {
    e.preventDefault();
    if (evaluateInputs([document.getElementById("email") as HTMLInputElement], 1, false)) {
        const BTN = document.getElementById("submit-email-extra-btn")!;
        const BEF = BTN.innerHTML;
        BTN.innerHTML = SPINNER_LOADER;
        Axios.post(ROUTES.client.api.addExtra.replace("0", ID.toString()), {
            type: 1,
            level: 1,
            value: (document.getElementById("email") as HTMLInputElement).value,
        })
            .then(res => {
                Toast.success(res.data);
                loadClient();
            })
            .catch(err => {
                Toast.error(err.response.data);
                console.error(err.response.data);
                BTN.innerHTML = BEF;
            });
    }
};

/**
 * Eliminar teléfono
 *
 * @param {Event} e
 */
const deletePhone = async (e: Event) => {
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
        Axios.delete(ROUTES.client.api.extraDelete.replace("0", ID.toString()))
            .then(res => {
                deleteElement(ELEMENT);
                Toast.success(res.data);
            })
            .catch(err => {
                console.error(err.response.data);
            });
    }
};

/**
 * Eliminar teléfono
 *
 * @param {Event} e
 */
const deleteEmail = async (e: Event) => {
    const ELEMENT = (e.currentTarget as HTMLElement).closest(".email-container") as HTMLElement;
    const ID = +ELEMENT.getAttribute("email-id")!;
    const EMAIL = ELEMENT.getAttribute("email-email")!;
    const ALERT = new Alert({
        type: 'danger',
        typeText: 'Alerta'
    });
    const res = await ALERT.updateBody(`¿Eliminar el correo <b>${EMAIL}</b>?`).show();
    if (res) {
        disableRow(ELEMENT);
        Axios.delete(ROUTES.client.api.extraDelete.replace("0", ID.toString()))
            .then(res => {
                deleteElement(ELEMENT);
                Toast.success(res.data);
            })
            .catch(err => {
                console.error(err.response.data);
            });
    }
};

/**
 * Eliminar contacto
 *
 * @param {Event} e
 */
const deleteContactAction = async (e: Event) => {
    const ELEMENT = (e.currentTarget as HTMLElement).closest(".contact-row") as HTMLElement;
    const NAME = ELEMENT.getAttribute("contactname")!;
    const ID = +ELEMENT.getAttribute("contactid")!;
    const ALERT = new Alert({
        type: 'danger',
        typeText: 'Alerta'
    });
    const res = await ALERT.updateBody(`¿Eliminar el contacto <b>${NAME}</b>?`).show();
    if (res) {
        MODAL.loadingBody();
        await Axios.delete(ROUTES.client.api.contactDelete.replace("0", ID.toString()))
            .then(res => {
                Toast.success(res.data);
                loadClient(false);
            })
            .catch(err => {
                console.error(err.response.data);
            });
    }
};

/**
 * Mostrar contacto
 *
 * @param {Event} e
 */
const showContactAction = (e: Event) => {
    MODAL.hide();
    showContact(+(e.currentTarget as HTMLInputElement).closest(".contact-row")!.getAttribute("contactid")!, showClientLocal);
};
