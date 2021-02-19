/**
* @packageDocumentation
* @module Client
*/
import Modal from "@plugins/Modal";
import Axios from "axios";
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import Toast from "@plugins/AlertToast";
import { evaluateInputs, insertAlertAfter } from "@plugins/Required";

/**
 * Opens modal to add a new client
 *
 * @export
 * @class Add
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Add {

    protected modal: Modal;

    protected callback: () => void;

    public constructor (callback: () => void = () => { }) {
        this.callback = callback;
        this.modal = new Modal({
            title: "Nuevo cliente",
            size: 30
        });
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(Router.generate(ROUTES.client.view.form));
            this.modal.updateBody(res.data);
            document.getElementById("clientForm")!.addEventListener("submit", this.validate);
        } catch (err) {
            console.error(err.response ? err.response.data : err);
            Toast.error(err.response ? err.response.data : err);
            this.modal.hide();
        }
    };

    private validate = async (e: Event) => {
        e.preventDefault();
        if (evaluateInputs(
            Array.from(document.getElementsByClassName("required")) as HTMLInputElement[],
            1
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;

            try {
                const res = await Axios.post(
                    Router.generate(ROUTES.client.api.add),
                    {
                        name: (document.getElementById("name") as HTMLInputElement).value,
                        phone: {
                            type: (document.getElementById("phoneType") as HTMLInputElement).value,
                            phone: (document.getElementById("phone") as HTMLInputElement).value,
                        },
                        email: (document.getElementById("email") as HTMLInputElement).value,
                        category: (document.getElementById("category-select") as HTMLInputElement).value
                    }
                );
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
