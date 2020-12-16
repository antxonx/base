/**
* view, add, edit and delete a client contact
* @packageDocumentation
* @module Client/Contact
* @preferred
*/
import {AddOptions, DEFAULT_ADD_OPTIONS} from "@scripts/client/contact/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import {Router, ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@plugins/AlertToast";
import {evaluateInputs, insertAlertAfter} from "@plugins/Required";

/**
 * Opens a modal to enter contact data and send a post request with the values if is validated
 *
 * @export
 * @class Add
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Add {
    protected options : AddOptions;
    protected modal: Modal;

    public constructor(options: AddOptions) {
        this.options = {...DEFAULT_ADD_OPTIONS, ...options};
        if(this.options.id === 0) {
            throw new Error("No se ha podido obtener información del cliente");
        }
        this.modal = new Modal({
            title: "Agregar contacto",
            size: 30,
            onHide: this.options.callback
        });
    }

    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.client.contact.view.form))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("clientContactForm")!.addEventListener("submit", this.validate);
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
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
            Axios.post(Router.generate(ROUTES.client.contact.api.add, {'id': this.options.id.toString()}), {
                name: (document.getElementById("name") as HTMLInputElement).value,
                role: (document.getElementById("role") as HTMLInputElement).value,
                phone: {
                    type: (document.getElementById("phoneType") as HTMLInputElement).value,
                    phone: (document.getElementById("phone") as HTMLInputElement).value,
                },
                email: (document.getElementById("email") as HTMLInputElement).value,
            })
                .then(res => {
                    Toast.success(res.data);
                    this.modal.hide();
                })
                .catch(err => {
                    insertAlertAfter(BTN, err.response.data);
                    console.error(err.response.data);
                    BTN.innerHTML = BEF;
                });
        }
    }
}
