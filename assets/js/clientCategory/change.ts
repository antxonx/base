/**
* @packageDocumentation
* @module Client/Category
*/
import { ClientCategoryChangeOptions, DEFAULT_CLIENT_CATEGORY_CHANGE_OPTIONS } from "@scripts/clientCategory/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import { BIG_LOADER, Router, ROUTES } from "@scripts/app";
import ListSelect from "@plugins/ListSelect";
import Alert from "@plugins/Alert";
import Toast from "@plugins/AlertToast";

/**
 * Change a client category
 *
 * @export
 * @class Change
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Change {

    protected options: ClientCategoryChangeOptions;

    protected modal: Modal;

    protected list: HTMLElement;

    public constructor (options: ClientCategoryChangeOptions) {
        this.options = { ...DEFAULT_CLIENT_CATEGORY_CHANGE_OPTIONS, ...options };
        this.list = document.createElement("div") as HTMLElement;
        this.modal = new Modal({
            title: "Cambiar de categoría",
            size: 50,
            onHide: this.options.onClose
        });
        if (this.options.idClient == 0) {
            throw new Error("No se ha podido identificar al cliente");
        }
    }

    public load = async () => {
        this.modal.show();

        try {
            const res = await Axios.get(
                Router.generate(ROUTES.clientCategory.view.changeForm, { 'id': this.options.idClient })
            );
            this.modal.updateBody(res.data);
            this.list = document.getElementById('categoryList') as HTMLElement;
            $('[data-toggle="tooltip"]').tooltip();
            this.startEvents();
        } catch (err) {
            this.modal.hide();
            throw new Error(err.response ? err.response.data : err);
        }
    };

    private listchange = async (data: string[]) => {
        if (Array.isArray(data) && data.length) {
            const LIST_BEF = this.list.innerHTML;
            this.list.innerHTML = BIG_LOADER;
            const res = await (new Alert({
                typeText: "Cuidado",
                type: "warning",
            }))
                .updateBody("¿Seguro que desea cambiar la categoría?")
                .show();
            if (res) {
                try {
                    await Axios.patch(
                        Router.generate(ROUTES.clientCategory.api.update),
                        {
                            clientId: this.options.idClient,
                            categoryId: data[ 0 ],
                        }
                    );
                    this.modal.hide();
                } catch (err) {
                    const e = err.response ? err.response.data : err;
                    console.error(e);
                    Toast.error(e);
                }
            }
            this.list.innerHTML = LIST_BEF;
            this.startEvents();
        }
    };

    private startEvents = () => {
        (new ListSelect({
            element: this.list,
            multiple: false,
            attribute: 'category-id',
            callback: this.listchange
        })).load();
    };
}
