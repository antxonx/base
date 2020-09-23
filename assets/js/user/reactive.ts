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
export const reactiveUser = (id: number, callback: () => void = CALLBACK) => {
    CALLBACK = callback;
    const ALERT = new AlertModal("Sí", "No", 1, accept, id);
    ALERT.updateBody(`¿Seguro que desea reactiar al usuario <b>${id}</b>?`).show();
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
    await Axios.patch(ROUTES.user.api.reactivate.replace("0", id.toString()), {
        suspended: 0
    })
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