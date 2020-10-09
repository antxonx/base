import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import {ROUTES, SPINNER_LOADER} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import {
    evaluateInputs,
    insertAlertAfter,
    clearErrorMsg,
    setValidInput,
    clearValidState
} from '@scripts/plugins/Required';

let CALLBACK: () => void = () => {
};
let MODAL: Modal;
let ID: number;

/**
 * Abrir modal de contraseña
 *
 * @param id
 * @param {() => void} [callback=CALLBACK]
 */
export const openKeyModal = (id: number, callback: () => void = CALLBACK) => {
    CALLBACK = callback;
    ID = id;
    MODAL = (new Modal("Cambiar contraseña a usuario " + ID, 60)).show();
    loadForm();
};


/**
 * Cargar formulario de contraseña
 *
 */
const loadForm = () => {
    Axios.get(ROUTES.user.view.key)
        .then(res => {
            MODAL.updateBody(res.data);
            document.getElementById("keyForm")!.addEventListener("submit", validate);
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
};

/**
 * Validar contraseña
 *
 * @param {Event} e
 */
const validate = (e: Event) => {
    e.preventDefault();
    const BTN = document.getElementById("submit-btn")!;
    const INPUTS = [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>];
    clearErrorMsg();
    if (evaluateInputs(INPUTS, 5)) {
        if (INPUTS[0].value === INPUTS[1].value) {
            INPUTS.forEach(el => setValidInput(el));
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            Axios.patch(ROUTES.user.api.keyUpdate.replace('0', ID.toString()), {
                password: INPUTS[0].value
            })
                .then(res => {
                    Toast.success(res.data);
                    MODAL.hide();
                })
                .catch(err => {
                    insertAlertAfter(BTN, err.response.data);
                    BTN.innerHTML = BEF;
                });
            console.log("Sí");
        } else {
            INPUTS.forEach(el => clearValidState(el));
            insertAlertAfter(BTN, "Las contraseñas no coinciden");
        }
    }
};
