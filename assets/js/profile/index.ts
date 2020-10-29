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
    $('.editable-field').editable({
        success: onSuccess,
        error: onError,
        disabled: true
    });
    document.getElementById('change-user-password')!.addEventListener('click', () => {
        passModal();
    });
    document.getElementById('profile-edit')!.addEventListener('click', () => {
        $('.editable-field').editable('toggleDisabled');
    });
};

loadEvs();
