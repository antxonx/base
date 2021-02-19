/**
* @packageDocumentation
* @module Schedule/Category
*/
import '@scripts/jquery';
import Modal from "@plugins/Modal";
import { ScheduleCategoryShowOptions, DEFAULT_SCHEDULE_CATEGORY_SHOW_OPTIONS } from "./defs";
import Axios from "axios";
import { ROUTES, Router } from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Show the category and allows to edit
 *
 * @export
 * @class Show
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Show {

    protected modal: Modal;

    protected options: ScheduleCategoryShowOptions;

    public constructor (options: ScheduleCategoryShowOptions) {
        this.options = { ...DEFAULT_SCHEDULE_CATEGORY_SHOW_OPTIONS, ...options };
        this.modal = new Modal({
            title: 'Categoría',
            size: 30
        });
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(
                Router.generate(ROUTES.scheduleCategory.view.show, { 'id': this.options.idCategory.toString() })
            );
            this.modal.updateBody(res.data);
            $('.editable-field').editable({
                success: (res: any) => {
                    Toast.success(res);
                    this.options.onClose();
                },
                error: (err: any) => {
                    console.error(err.responseText);
                    Toast.error(err.responseText);
                },
                disabled: false
            });
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };
}
