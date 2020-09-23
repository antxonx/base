import AlertModal from '@scripts/plugins/AlertModal';
import Axios from 'axios';
import Toast from '@scripts/plugins/AlertToast';
import { ROUTES } from '@scripts/app';
let CALLBACK: () => void = () => { };

/**
 * Eliminar usuario
 *
 * @param {number} id
 * @param {() => void} [callback=CALLBACK]
 */
export const deleteUser = (id: number, callback: () => void = CALLBACK) => {
    CALLBACK = callback;
    const ALERT = new AlertModal("sí", "No", 1, accept, id);
    ALERT.updateBody(`¿Seguro que desea eliminar al usuario <b>${id}</b>?`).show();
};

/**
 * Aceptar alerta
 *
 * @param {number} _
 * @param {number} id
 * @returns {Promise<boolean>}
 */
const accept = async (_: number, id: number): Promise<boolean> => {
    let result = false;
    await Axios.delete(ROUTES.user.api.delete.replace("0", id.toString()))
        .then(res => {
            result = true;
            Toast.success(res.data);
            CALLBACK();
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
    return result;
};