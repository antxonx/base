import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import {ROUTES, Router, SPINNER_LOADER} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import {evaluateInputs, insertAlertAfter} from '@scripts/plugins/Required';

let MODAL: Modal;
let ID: number;

/**
 * Abrir modal del formulario
 *
 * @param {number} id
 * @param {() => void} [callback=CALLBACK]
 */
export const openContactModal = (id: number, callback: () => void = () => {
}) => {
    ID = id;
    MODAL = (new Modal({
        title: "Agregar contacto",
        size: 30,
        onHide: callback
    })).show();
    loadForm();
};

/**
 * Cargar formulario de contacto
 *
 */
const loadForm = () => {
    Axios.get(Router.generate(ROUTES.client.contact.view.form))
        .then(res => {
            MODAL.updateBody(res.data);
            document.getElementById("clientContactForm")!.addEventListener("submit", validate);
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
};

/**
 * Validar datos del formulario
 *
 * @param {Event} e
 */
const validate = (e: Event) => {
    e.preventDefault();
    if (evaluateInputs(
        [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>],
        1
    )) {
        const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
        const BEF = BTN.innerHTML;
        BTN.innerHTML = SPINNER_LOADER;
        Axios.post(Router.generate(ROUTES.client.contact.api.add, {'id' : ID.toString()}), {
            name: (document.getElementById("name") as HTMLInputElement).value,
            role: (document.getElementById("role") as HTMLInputElement).value,
            phone: {
                type: (document.getElementById("phoneType") as HTMLInputElement).value,
                phone: (document.getElementById("phone") as HTMLInputElement).value,
            },
            email: (document.getElementById("email") as HTMLInputElement).value,
        })
            .then(res => {
                Toast.success(res.data);
                MODAL.hide();
            })
            .catch(err => {
                insertAlertAfter(BTN, err.response.data);
                console.error(err.response.data);
                BTN.innerHTML = BEF;
            });
    }

};
