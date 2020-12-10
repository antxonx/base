import Modal from "@plugins/Modal";
import {ClientCategoryShowOptions, DEFAULT_CLIENT_CATEGORY_SHOW_OPTIONS} from "@scripts/clientCategory/defs";

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


}
