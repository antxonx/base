import $ from 'jquery';
import Toast from "@plugins/AlertToast";
import '@scripts/app';

/**
 * Cargar eventos
 */
const loadEvs = () => {
    $('.editable-field').editable({
        success: onSuccess,
        error: onError
    });
};

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

loadEvs();
