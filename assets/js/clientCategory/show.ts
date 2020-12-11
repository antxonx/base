import $ from 'jquery';
import 'bootstrap';
import Modal from "@plugins/Modal";
import {ClientCategoryShowOptions, DEFAULT_CLIENT_CATEGORY_SHOW_OPTIONS} from "@scripts/clientCategory/defs";
import Axios from "axios";
import {ROUTES, Router} from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Show class
 *
 * @export
 * @class Show
 */
export default class Show {

    /**
     * modal
     *
     * @protected
     * @type {Modal}
     * @memberof Show
     */
    protected modal: Modal

    /**
     * options
     *
     * @protected
     * @type {ClientCategoryShowOptions}
     * @memberof Show
     */
    protected options: ClientCategoryShowOptions;

    /**
     * Creates an instance of Show.
     * @param {ClientCategoryShowOptions} options
     * @memberof Show
     */
    public constructor(options: ClientCategoryShowOptions) {
        this.options = {...DEFAULT_CLIENT_CATEGORY_SHOW_OPTIONS, ...options};
        this.modal = new Modal({
            title: 'Categoría',
            size: 30
        });
    }

    /**
     * load
     *
     * @memberof Show
     */
    public load = () => {
        this.modal.show();
        console.log(Router);
        Axios.get(Router.generate(ROUTES.clientCategory.view.show, {'id': this.options.idCategory.toString()}))
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
