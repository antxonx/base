import Alert from '@scripts/plugins/Alert';
import Axios from 'axios';
import Toast from '@scripts/plugins/AlertToast';
import {ROUTES} from '@scripts/app';
import {deleteElement, disableRow, restoreRow} from '@scripts/plugins/DeleteElement';

/**
 * reactivar usuario
 *
 * @param {HTMLElement} element
 * @param {() => void} [onSuccess=() => { }]
 * @param {() => void} [onError=() => { }]
 */
export const reactiveUser = async (element: HTMLElement, onSuccess: () => void = () => {
}, onError: () => void = () => {
}) => {
    const ID = +element.getAttribute("id")!;
    const NAME = +element.getAttribute("name")!;
    const ALERT = new Alert({
        type: 'danger',
        typeText: 'Alerta'
    });
    let res = await ALERT.updateBody(`¿Reactivar a <b>${NAME}</b>?`).show();
    if (res) {
        const BTNS_BEF = disableRow(element);
        Axios.patch(ROUTES.user.api.reactivate.replace("0", ID.toString()))
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
