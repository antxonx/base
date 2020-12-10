import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import {ROUTES, SPINNER_LOADER} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import {evaluateInputs, insertAlertAfter} from '@scripts/plugins/Required';

let MODAL: Modal;
let CALLBACK: () => void = () => {
};

/**
 *  Abrir modal de formulario
 *
 * @param {() => void} [callback=CALLBACK]
 */
export const openAddModal = (callback: () => void = CALLBACK) => {
    CALLBACK = callback;
    MODAL = (new Modal({
        title: "Nuevo cliente",
        size: 30
    })).show();
    loadForm();
};

/**
 * Cargar formualrio
 *
 */
const loadForm = () => {
    Axios.get(ROUTES.client.view.form)
        .then(res => {
            MODAL.updateBody(res.data);
            document.getElementById("clientForm")!.addEventListener("submit", validate);
        })
        .catch(err => {
            Toast.error(err.response.data);
            console.error(err.response.data);
            MODAL.hide();
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
        Axios.post(ROUTES.client.api.add, {
            name: (document.getElementById("name") as HTMLInputElement).value,
            phone: {
                type: (document.getElementById("phoneType") as HTMLInputElement).value,
                phone: (document.getElementById("phone") as HTMLInputElement).value,
            },
            email: (document.getElementById("email") as HTMLInputElement).value,
            category: (document.getElementById("category-select") as HTMLInputElement).value
        })
            .then(res => {
                Toast.success(res.data);
                MODAL.hide();
                CALLBACK();
            })
            .catch(err => {
                insertAlertAfter(BTN, err.response.data);
                console.error(err.response.data);
                BTN.innerHTML = BEF;
            });
    }

};
