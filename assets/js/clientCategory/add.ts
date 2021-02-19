/**
* @packageDocumentation
* @module Client/Category
*/
import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import { ROUTES, Router, SPINNER_LOADER } from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import { evaluateInputs, insertAlertAfter } from '@scripts/plugins/Required';

/**
 * Add a new category for clients
 *
 * @export
 * @class ClientCategoryAdd
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class ClientCategoryAdd {

    protected modal: Modal;

    protected callback: () => void;

    public constructor (callback: () => void = () => { }) {
        this.callback = callback;
        this.modal = (new Modal({
            title: "Nueva categoría",
            size: 30
        }));
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(Router.generate(ROUTES.clientCategory.view.form));
            this.modal.updateBody(res.data);
            document.getElementById("clientCategoryForm")!.addEventListener("submit", this.validate);
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
            this.modal.hide();
        }
    };

    private validate = async (e: Event) => {
        e.preventDefault();
        if (evaluateInputs(
            Array.from(document.getElementsByClassName("required")) as HTMLInputElement[],
            0
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            const DATA = {
                name: (document.getElementById("name") as HTMLInputElement).value,
                description: (document.getElementById("description") as HTMLInputElement).value,
                color: (document.getElementById("color") as HTMLInputElement).value,
            };
            try {
                const res = await Axios.post(Router.generate(ROUTES.clientCategory.api.add), DATA);
                Toast.success(res.data);
                this.modal.hide();
                this.callback();
            } catch (err) {
                const e = err.response ? err.response.data : err;
                insertAlertAfter(BTN, e);
                console.error(e);
                BTN.innerHTML = BEF;
            }
        }
    };
}
