import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import {ROUTES, SPINNER_LOADER} from '@scripts/app';
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
export const openAddressModal = (id: number, callback: () => void = () => {
}) => {
    ID = id;
    MODAL = (new Modal({
        title: "Agregar dirección",
        size: 70,
        onHide: callback
    })).show();
    loadForm();
};

/**
 * Cargar formulario de dirección
 *
 */
const loadForm = () => {
    Axios.get(ROUTES.client.view.addresForm.replace('0', ID.toString()))
        .then(res => {
            MODAL.updateBody(res.data);
            document.getElementById("clientAddressForm")!.addEventListener("submit", validate);
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
        Axios.post(ROUTES.client.api.addressAdd, {
            id: ID,
            street: (document.getElementById("street") as HTMLInputElement).value,
            extnum: (document.getElementById("extnum") as HTMLInputElement).value,
            intnum: (document.getElementById("intnum") as HTMLInputElement).value,
            city: (document.getElementById("city") as HTMLInputElement).value,
            state: (document.getElementById("state") as HTMLInputElement).value,
            country: (document.getElementById("country") as HTMLInputElement).value,
            postal: (document.getElementById("postal") as HTMLInputElement).value,
        })
            .then(res => {
                Toast.success(res.data);
                MODAL.hide();
            })
            .catch(err => {
                console.error(err.response.data);
                insertAlertAfter(BTN, err.response.data);
                BTN.innerHTML = BEF;
            });
    }
};
