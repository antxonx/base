/**
* @packageDocumentation
* @module Schedule/Category
*/
import { ScheduleCategoryDeleteOptions, DEFAULT_SCHEDULE_CATEGORY_DELETE_OPTIONS } from "./defs";
import Alert from "@plugins/Alert";
import { deleteElement, disableRow, restoreRow } from "@plugins/DeleteElement";
import Axios from "axios";
import { ROUTES, Router } from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Delete a category
 *
 * @export
 * @class ScheduleCategoryDelete
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class ScheduleCategoryDelete {

    protected options: ScheduleCategoryDeleteOptions;

    public constructor (options: ScheduleCategoryDeleteOptions) {
        this.options = { ...DEFAULT_SCHEDULE_CATEGORY_DELETE_OPTIONS, ...options };
    }

    public delete = async () => {
        const ID = +this.options.element.getAttribute("id")!;
        const NAME = this.options.element.getAttribute("name")!;
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Alerta'
        });
        let res = await ALERT.updateBody(`¿Eliminar la categoría <b>${NAME}</b>?`).show();
        if (res) {
            const BTNS_BEF = disableRow(this.options.element);
            try {
                const res = await Axios.delete(
                    Router.generate(ROUTES.scheduleCategory.api.delete, { 'id': ID.toString() })
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
