import Modal from "@scripts/plugins/Modal";
import Axios from "axios";
import Alert from '@scripts/plugins/Alert';
import {ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import {evaluateInputs, hideElement, showElement} from "@scripts/plugins/Required";
import {deleteElement, disableRow} from "@scripts/plugins/DeleteElement";

let MODAL: Modal;
let ID: number;

/**
 * Mostrar contacto
 *
 * @param {number} id
 * @param {() => void} [callback=() => {}]
 */
export const showContact = (id: number, callback: () => void = () => {
}) => {
    ID = id;
    MODAL = (new Modal("Contacto", 50, callback)).show();
    loadView();
};

const loadView = () => {
    MODAL.loadingBody();
    Axios.get(ROUTES.client.view.contactShow.replace('0', ID.toString()))
        .then(res => {
            MODAL.updateBody(res.data);
            $('.editable-field').editable({
                success: onSuccess,
                error: onError,
                disabled: true
            });
            /* --------------------------------- Eventos -------------------------------- */
            //Editar
            document.getElementById("contact-edit-active")!.addEventListener("click", toggleEdit);
            //.
            //Datos extra
            document.getElementById("contact-phone-extra-form")!.addEventListener("submit", addExtraPhone);
            document.getElementById("contact-email-extra-form")!.addEventListener("submit", addExtraEmail);
            [...document.getElementsByClassName("trash-phone")].forEach(el => el.addEventListener('click', deletePhone));
            [...document.getElementsByClassName("trash-email")].forEach(el => el.addEventListener('click', deleteEmail));
            //.
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
};

/**
 * Sí se pudo editar el cliente
 *
 * @param {*} res
 */
const onSuccess = (res: any) => {
    Toast.success(res);
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
        BTN.innerHTML = "Editar Contacto";
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
        Axios.post(ROUTES.client.api.addContactExtra.replace("0", ID.toString()), {
            type: 2,
            level: (document.getElementById("phoneType") as HTMLInputElement).value,
            value: (document.getElementById("phone") as HTMLInputElement).value,
        })
            .then(res => {
                Toast.success(res.data);
                loadView();
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
        Axios.post(ROUTES.client.api.addContactExtra.replace("0", ID.toString()), {
            type: 1,
            level: 1,
            value: (document.getElementById("email") as HTMLInputElement).value,
        })
            .then(res => {
                Toast.success(res.data);
                loadView();
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
    const PHONE = +ELEMENT.getAttribute("phone-phone")!;
    const ALERT = new Alert({
        type: 'danger',
        typeText: 'Alerta'
    });
    const res = await ALERT.updateBody(`¿Eliminar el número ${PHONE}?`).show();
    if (res) {
        disableRow(ELEMENT);
        Axios.delete(ROUTES.client.api.extraContactDelete.replace("0", ID.toString()))
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
    const NAME = ELEMENT.getAttribute("email-email")!;
    const ALERT = new Alert({
        type: 'danger',
        typeText: 'Alerta'
    });
    const res = await ALERT.updateBody(`¿Eliminar el correo ${NAME}?`).show();
    if (res) {
        disableRow(ELEMENT);
        Axios.delete(ROUTES.client.api.extraContactDelete.replace("0", ID.toString()))
            .then(res => {
                deleteElement(ELEMENT);
                Toast.success(res.data);
            })
            .catch(err => {
                console.error(err.response.data);
            });
    }
};
