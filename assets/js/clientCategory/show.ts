import Modal from "@plugins/Modal";
import {ClientCategoryShowOptions, DEFAULT_CLIENT_CATEGORY_SHOW_OPTIONS} from "@scripts/clientCategory/defs";
import Axios from "axios";
import {Router} from "@scripts/app";
import Toast from "@plugins/AlertToast";

export default class Show
{
    protected modal: Modal

    protected options: ClientCategoryShowOptions;

    public constructor(options: ClientCategoryShowOptions) {
        this.options = {...DEFAULT_CLIENT_CATEGORY_SHOW_OPTIONS, ...options};
        this.modal = new Modal({
            title: 'Categoría',
            size: 50
        });
    }

    public load = () => {
        this.modal.show();
        console.log(Router);
        Axios.get(Router.generate('client_category_show', {'id': this.options.idCategory.toString()}))
            .then(res => {
                this.modal.updateBody(res.data);
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    }
}
