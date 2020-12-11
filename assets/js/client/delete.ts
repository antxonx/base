import Alert from '@scripts/plugins/Alert';
import Axios from 'axios';
import Toast from '@scripts/plugins/AlertToast';
import {ROUTES, Router} from '@scripts/app';
import {deleteElement, disableRow, restoreRow} from '@scripts/plugins/DeleteElement';

/**
 * Eliminar usuario
 *
 * @param {HTMLElement} element
 * @param {() => void} [onSuccess=() => { }]
 * @param {() => void} [onError=() => { }]
 */
export const deleteClient = async (element: HTMLElement, onSuccess: () => void = () => {
}, onError: () => void = () => {
}) => {
    const ID = +element.getAttribute("id")!;
    const NAME = element.getAttribute("name")!;
    const ALERT = new Alert({
        type: 'danger',
        typeText: 'Alerta'
    });
    let res = await ALERT.updateBody(`¿Eliminar a <b>${NAME}</b>?`).show();
    if (res) {
        const BTNS_BEF = disableRow(element);
        Axios.delete(Router.generate(ROUTES.client.api.delete))
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
