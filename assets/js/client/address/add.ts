import {AddOptions, DEFAULT_ADD_OPTIONS} from "@scripts/client/address/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import {Router, ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@plugins/AlertToast";
import {evaluateInputs, insertAlertAfter} from "@plugins/Required";

/**
 * Add class
 *
 * @export
 * @class Add
 */
export default class Add {

    /**
     * options
     *
     * @protected
     * @type {AddOptions}
     * @memberof Add
     */
    protected options: AddOptions;

    /**
     * modal
     *
     * @protected
     * @type {Modal}
     * @memberof Add
     */
    protected modal: Modal;

    /**
     * Creates an instance of Add.
     * @param {AddOptions} options
     * @memberof Add
     */
    public constructor(options: AddOptions) {
        this.options = {...DEFAULT_ADD_OPTIONS,...options};
        if(this.options.id === 0) {
            throw new Error("No se ha podido obtener información del cliente");
        }
        this.modal = new Modal({
            title: "Agregar dirección",
            size: 70,
            onHide: this.options.callback
        });
    }

    /**
     *load
     *
     * @memberof Add
     */
    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.client.address.view.form, {'id': this.options.id.toString()}))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("clientAddressForm")!.addEventListener("submit", this.validate);
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    }

    /**
     * validate
     *
     * @memberof Add
     */
    public validate = (e: Event) => {
        e.preventDefault();
        if (evaluateInputs(
            [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>],
            1
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            Axios.post(Router.generate(ROUTES.client.address.api.add), {
                id: this.options.id,
                street: (document.getElementById("street") as HTMLInputElement).value,
                extnum: (document.getElementById("extnum") as HTMLInputElement).value,
                intnum: (document.getElementById("intnum") as HTMLInputElement).value,
                city: (document.getElementById("city") as HTMLInputElement).value,
                state: (document.getElementById("state") as HTMLInputElement).value,
                country: (document.getElementById("country") as HTMLInputElement).value,
                postal: (document.getElementById("postal") as HTMLInputElement).value,
            })
                .then(res => {
                    Toast.success(res.data);
                    this.modal.hide();
                })
                .catch(err => {
                    console.error(err.response.data);
                    insertAlertAfter(BTN, err.response.data);
                    BTN.innerHTML = BEF;
                });
        }
    }
}
