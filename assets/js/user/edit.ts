import Modal from '@scripts/plugins/Modal';
import {ROUTES} from '@scripts/app';
import Axios from 'axios';
import Toast from '@scripts/plugins/AlertToast';

let CALLBACK: () => void = () => {
};
let ID: number;
let MODAL: Modal;

/**
 * Editar a un proveedor
 *
 * @param {number} id
 * @param {() => void} [callback=CALLBACK]
 */
export const editUser = (id: number, callback: () => void = CALLBACK) => {
    CALLBACK = callback;
    ID = id;
    MODAL = (new Modal("Usuario " + ID, 40)).show();
    loadEdit();
};

/**
 * Cargar formulario
 *
 */
const loadEdit = () => {
    Axios.get(ROUTES.user.view.edit.replace('0', ID.toString()))
        .then(res => {
            MODAL.updateBody(res.data);
            $('.editable-field').editable({
                success: onSuccess,
                error: onError,
                disabled: true
            });
            document.getElementById("user-edit-active")!.addEventListener("click", toggleEdit);
        })
        .catch(err => {
            console.error(err);
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
        BTN.innerHTML = "Editar";
    } else {
        BTN.setAttribute("active", "1");
        BTN.classList.remove("btn-warning");
        BTN.classList.add("btn-danger");
        BTN.innerHTML = "Cancelar";
    }
    $('.editable-field').editable('toggleDisabled');
};

/**
 * Sí se pudo editar el usuario
 *
 * @param {*} res
 */
const onSuccess = (res: any) => {
    Toast.success(res);
    CALLBACK();
};

/**
 * No se pudo editar el usuario
 *
 * @param {*} err
 */
const onError = (err: any) => {
    console.error(err.responseText);
    Toast.error(err.responseText);
};
