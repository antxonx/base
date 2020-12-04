import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import {SPINNER_LOADER} from '@scripts/app';
import {evaluateInputs, clearErrorMsg, insertAlertAfter} from '@scripts/plugins/Required';
import {ROUTES} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';

let MODAL: Modal;
let CALLBACK: () => void = () => {
};

/**
 * Abrir modal
 *
 * @param {() => void} [callback=() => {}]
 */
export const openModal = (callback: () => void = () => {
}) => {
    CALLBACK = callback;
    MODAL = new Modal({
        title: "Nuevo usuario",
        size: 30
    });
    MODAL.show();
    Axios.get(ROUTES.user.view.form)
        .then(res => {
            MODAL.updateBody(res.data);
            document.getElementById("userForm")!.addEventListener("submit", validate);
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
};

/**
 * Validar datos de formulario
 *
 * @param {Event} e
 */
const validate = (e: Event) => {
    e.preventDefault();
    clearErrorMsg();
    if (evaluateInputs(
        [...(document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>)],
        5
    )) {
        //const ROLE = (document.getElementById("roleSelector") as HTMLInputElement).value;
        const ROLE = document.querySelectorAll('.check-roles:checked');
        const BTN = document.getElementById("submit-btn")!;
        if (ROLE.length > 0) {
            const BTN_BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            Axios.post(ROUTES.user.api.add, {
                username: (document.getElementById("username") as HTMLInputElement).value,
                password: (document.getElementById("password") as HTMLInputElement).value,
                email: (document.getElementById("email") as HTMLInputElement).value,
                name: (document.getElementById("name") as HTMLInputElement).value,
                roles: [...ROLE.values()].map((el) => (el as HTMLInputElement).value),
            })
                .then(() => {
                    CALLBACK();
                    MODAL.hide();
                })
                .catch(err => {
                    console.error(err.response.data);
                    insertAlertAfter(BTN, err.response.data);
                    BTN.innerHTML = BTN_BEF;
                });
        } else {
            insertAlertAfter(BTN, "Debe seleccionar un puesto");
        }
    }
};
