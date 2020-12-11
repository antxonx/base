import {DEFAULT_DELETE_REACTIVE_OPTIONS, DeleteReactiveOptions} from "@scripts/user/defs";
import Alert from "@plugins/Alert";
import {deleteElement, disableRow, restoreRow} from "@plugins/DeleteElement";
import Axios from "axios";
import {Router, ROUTES} from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Delete class
 *
 * @export
 * @class Delete
 */
export default class Delete {

    /**
     * options
     *
     * @protected
     * @type {DeleteReactiveOptions}
     * @memberof Delete
     */
    protected options: DeleteReactiveOptions;

    /**
     * Creates an instance of Delete.
     * @param {DeleteReactiveOptions} options
     * @memberof Delete
     */
    public constructor(options: DeleteReactiveOptions) {
        this.options = {...DEFAULT_DELETE_REACTIVE_OPTIONS, ...options};
        this.options.id = this.options.id || +this.options.element.getAttribute("id")!;
        this.options.name = this.options.name || this.options.element.getAttribute("name")!;
        this.options.username = this.options.username || this.options.element.getAttribute("username")!;
    }

    /**
     * delete
     *
     * @memberof Delete
     */
    public delete = async () => {
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Alerta'
        });
        let res = await ALERT.updateBody(`¿Suspender a <b>${this.options.name}</b>(${this.options.username})?`).show();
        if (res) {
            const BTNS_BEF = disableRow(this.options.element);
            Axios.delete(Router.generate(ROUTES.user.api.delete, {'id': this.options.id!.toString()}))
                .then(res => {
                    Toast.success(res.data);
                    deleteElement(this.options.element);
                    this.options.onSuccess!();
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                    restoreRow(this.options.element, BTNS_BEF);
                    this.options.onError!();
                });
        }
    }

    /**
     * reactive
     *
     * @memberof Delete
     */
    public reactive = async () => {
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Alerta'
        });
        let res = await ALERT.updateBody(`¿Reactivar a <b>${this.options.name}</b>(${this.options.username})?`).show();
        if (res) {
            const BTNS_BEF = disableRow(this.options.element);
            Axios.patch(Router.generate(ROUTES.user.api.reactive, {'id': this.options.id!.toString()}))
                .then(res => {
                    Toast.success(res.data);
                    deleteElement(this.options.element);
                    this.options.onSuccess!();
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                    restoreRow(this.options.element, BTNS_BEF);
                    this.options.onError!();
                });
        }
    }
}
