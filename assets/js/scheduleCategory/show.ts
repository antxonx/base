/**
* @packageDocumentation
* @module Schedule/Category
*/
import 'bootstrap';
import Modal from "@plugins/Modal";
import {ScheduleCategoryShowOptions, DEFAULT_SCHEDULE_CATEGORY_SHOW_OPTIONS} from "./defs";
import Axios from "axios";
import {ROUTES, Router} from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Show the category and allows to edit
 *
 * @export
 * @class Show
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Show {

    protected modal: Modal

    protected options: ScheduleCategoryShowOptions;

    public constructor(options: ScheduleCategoryShowOptions) {
        this.options = {...DEFAULT_SCHEDULE_CATEGORY_SHOW_OPTIONS, ...options};
        this.modal = new Modal({
            title: 'Categoría',
            size: 30
        });
    }

    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.scheduleCategory.view.show, {'id': this.options.idCategory.toString()}))
            .then(res => {
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
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    }
}
