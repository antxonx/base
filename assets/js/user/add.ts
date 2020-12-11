import Modal from "@plugins/Modal";
import Axios from "axios";
import {Router, ROUTES, SPINNER_LOADER} from "@scripts/app";
import Toast from "@plugins/AlertToast";
import {clearErrorMsg, evaluateInputs, insertAlertAfter} from "@plugins/Required";

/**
 * Add class
 *
 * @export
 * @class Add
 */
export default class Add {

    /**
     * modal
     *
     * @protected
     * @type {Modal}
     * @memberof Add
     */
    protected modal: Modal;

    /**
     * callback
     *
     * @protected
     * @memberof Add
     */
    protected callback: () => void;

    /**
     * Creates an instance of Add.
     * @param {() => void} [callback=() => {}]
     * @memberof Add
     */
    public constructor(callback: () => void = () => {}) {
        this.callback = callback;
        this.modal = new Modal({
            title: 'Nuevo usuario',
            size: 30
        });
    }

    /**
     * load
     *
     * @memberof Add
     */
    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.user.view.form))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("userForm")!.addEventListener("submit", this.validate);
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    }

    /**
     * validate
     *
     * @private
     * @memberof Add
     */
    private validate = (e: Event) => {
        e.preventDefault();
        clearErrorMsg();
        if (evaluateInputs(
            [...(document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>)],
            5
        )) {
            const ROLE = document.querySelectorAll('.check-roles:checked');
            const BTN = document.getElementById("submit-btn")!;
            if (ROLE.length > 0) {
                const BTN_BEF = BTN.innerHTML;
                BTN.innerHTML = SPINNER_LOADER;
                Axios.post(Router.generate(ROUTES.user.api.add), {
                    username: (document.getElementById("username") as HTMLInputElement).value,
                    password: (document.getElementById("password") as HTMLInputElement).value,
                    email: (document.getElementById("email") as HTMLInputElement).value,
                    name: (document.getElementById("name") as HTMLInputElement).value,
                    roles: [...ROLE.values()].map((el) => (el as HTMLInputElement).value),
                })
                    .then(() => {
                        this.callback();
                        this.modal.hide();
                    })
                    .catch(err => {
                        console.error(err.response.data);
                        insertAlertAfter(BTN, err.response.data);
                        BTN.innerHTML = BTN_BEF;
                    });
            } else {
                insertAlertAfter(BTN, "Debe seleccionar un puesto");
            }
        }
    }
}
