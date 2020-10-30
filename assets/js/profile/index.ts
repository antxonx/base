import $ from 'jquery';
import Toast from "@plugins/AlertToast";
import '@scripts/app';
import {passModal} from "@scripts/profile/pass";

/**
 * Sí se pudo editar el usuario
 *
 * @param {*} res
 */
const onSuccess = (res: any) => {
    Toast.success(res);
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

/**
 * Cargar eventos
 */
const loadEvs = () => {
    const EDIT_BTN = document.getElementById('profile-edit')!;
    $('.editable-field').editable({
        success: onSuccess,
        error: onError,
        disabled: true
    });
    document.getElementById('change-user-password')!.addEventListener('click', () => {
        passModal();
    });

    EDIT_BTN.addEventListener('click', () => {
        if(!!+EDIT_BTN.getAttribute('active')!){
            EDIT_BTN.setAttribute('active', '0');
            EDIT_BTN.innerHTML = "Editar";
            EDIT_BTN.classList.remove('btn-danger');
            EDIT_BTN.classList.add('btn-warning');
        } else {
            EDIT_BTN.setAttribute('active', '1');
            EDIT_BTN.innerHTML = "Cancelar";
            EDIT_BTN.classList.remove('btn-warning');
            EDIT_BTN.classList.add('btn-danger');
        }
        $('.editable-field').editable('toggleDisabled');
    });
};

loadEvs();
