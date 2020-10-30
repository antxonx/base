import Modal from "@plugins/Modal";
import {ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@plugins/AlertToast";
import Axios, {AxiosError, AxiosResponse} from "axios";
import {clearErrorMsg, clearValidState, evaluateInputs, insertAlertAfter, setValidInput} from "@plugins/Required";

let MODAL: Modal;

const PASS = {
    OLD: 0,
    NEW: 1,
    CONF: 2
};

/**
 * Abrir modal para cambiar contraseña
 * @param onHide
 */
export const passModal = (onHide: () => void = () => {
}) => {
    MODAL = (new Modal('Cambiar contraseña', 30, onHide)).show();
    loadForm();
};

/**
 * Cargar formulario
 */
const loadForm = () => {
    Axios.get(ROUTES.user.view.passform)
        .then((res: AxiosResponse) => {
            MODAL.updateBody(res.data);
            document.getElementById('passForm')!.addEventListener('submit', validate);
        })
        .catch((err: AxiosError) => {
            console.error(err.response?.data);
            Toast.error(err.response?.data);
        });
};

/**
 * Validar formulario
 *
 * @param {Event} e
 */
const validate = (e: Event) => {
    e.preventDefault();
    const BTN = document.getElementById("submit-btn")!;
    const INPUTS = [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>];
    clearErrorMsg();
    INPUTS.forEach(el => console.log(el.value));
    if (evaluateInputs(INPUTS, 5)) {
        console.log("valid");
        if (INPUTS[PASS.NEW].value === INPUTS[PASS.CONF].value) {
            console.log("valid2");
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            setValidInput(INPUTS[PASS.NEW]);
            setValidInput(INPUTS[PASS.CONF]);
            Axios.put(ROUTES.user.api.passchange, {
                old: INPUTS[PASS.OLD].value,
                new: INPUTS[PASS.NEW].value,
                conf: INPUTS[PASS.CONF].value,
            })
                .then((res: AxiosResponse) => {
                    Toast.success(res.data);
                    MODAL.hide();
                })
                .catch((err: AxiosError) => {
                    insertAlertAfter(BTN, err.response?.data);
                    BTN.innerHTML = BEF;
                });
        } else {
            console.log("invaid");
            clearValidState(INPUTS[PASS.NEW]);
            clearValidState(INPUTS[PASS.CONF]);
            insertAlertAfter(BTN, "Las contraseñas no coinciden");
        }
    }
};
