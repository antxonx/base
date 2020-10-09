import Alert from '@scripts/plugins/Alert';
import Axios from 'axios';
import Toast from '@scripts/plugins/AlertToast';
import {ROUTES} from '@scripts/app';
import {deleteElement, disableRow, restoreRow} from '@scripts/plugins/DeleteElement';

/**
 * Eliminar usuario
 *
 * @param {HTMLElement} element
 * @param {() => void} [onSuccess=() => { }]
 * @param {() => void} [onError=() => { }]
 */
export const deleteUser = async (element: HTMLElement, onSuccess: () => void = () => {
}, onError: () => void = () => {
}) => {
    const ID = +element.getAttribute("id")!;
    const ALERT = new Alert(true);
    let res = await ALERT.updateBody(`¿Seguro que quiere suspender al usuario <b>${ID}</b>?`).show();
    if (res) {
        const BTNS_BEF = disableRow(element);
        Axios.delete(ROUTES.user.api.delete.replace("0", ID.toString()))
            .then(res => {
                Toast.success(res.data);
                deleteElement(element);
                onSuccess();
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
                restoreRow(element, BTNS_BEF);
                onError();
            });
    }
};
