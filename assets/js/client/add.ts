/** @module Client */
import Modal from "@plugins/Modal";
import Axios from "axios";
import {Router, ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@plugins/AlertToast";
import {evaluateInputs, insertAlertAfter} from "@plugins/Required";

/**
 * Add client class
 *
 * @export
 * @class Add
 * @classdesc Opens modal to add a new client
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Add {

    protected modal: Modal;

    protected callback : () => void;

    public constructor(callback : () => void = () => {}) {
        this.callback = callback;
        this.modal = new Modal({
            title: "Nuevo cliente",
            size: 30
        });
    }

    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.client.view.form))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("clientForm")!.addEventListener("submit", this.validate);
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
                this.modal.hide();
            });
    }

    private validate = (e: Event) => {
        e.preventDefault();
        if (evaluateInputs(
            [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>],
            1
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            Axios.post(Router.generate(ROUTES.client.api.add), {
                name: (document.getElementById("name") as HTMLInputElement).value,
                phone: {
                    type: (document.getElementById("phoneType") as HTMLInputElement).value,
                    phone: (document.getElementById("phone") as HTMLInputElement).value,
                },
                email: (document.getElementById("email") as HTMLInputElement).value,
                category: (document.getElementById("category-select") as HTMLInputElement).value
            })
                .then(res => {
                    Toast.success(res.data);
                    this.modal.hide();
                    this.callback();
                })
                .catch(err => {
                    insertAlertAfter(BTN, err.response.data);
                    console.error(err.response.data);
                    BTN.innerHTML = BEF;
                });
        }
    }
}
