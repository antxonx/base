/**
* @packageDocumentation
* @module Client
*/
import { DEFAULT_DELETE_OPTIONS, DeleteOptions } from "@scripts/client/defs";
import Alert from "@plugins/Alert";
import { deleteElement, disableRow, restoreRow } from "@plugins/DeleteElement";
import Axios from "axios";
import { Router, ROUTES } from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Opens an alert to confirm if delete client or not
 *
 * @export
 * @class Delete
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Delete {

    protected options: DeleteOptions;

    public constructor (options: DeleteOptions) {
        this.options = { ...DEFAULT_DELETE_OPTIONS, ...options };
        this.options.id = this.options.id || +this.options.element.getAttribute('id')!;
        this.options.name = this.options.name || this.options.element.getAttribute('name')!;
    }

    public delete = async () => {
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Alerta'
        });
        const res = await ALERT.updateBody(`¿Eliminar a <b>${this.options.name}</b>?`).show();
        if (res) {
            const BTNS_BEF = disableRow(this.options.element);
            try {
                const res = await Axios.delete(
                    Router.generate(ROUTES.client.api.delete, {
                        'id': this.options.id!.toString()
                    })
                );
                Toast.success(res.data);
                deleteElement(this.options.element);
                this.options.onSuccess!();
            } catch (err) {
                const e = err.response ? err.response.data : err;
                console.error(e);
                Toast.error(e);
                restoreRow(this.options.element, BTNS_BEF);
                this.options.onError!();
            }
        }
    };
}
