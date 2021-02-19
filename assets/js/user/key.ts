/**
* @packageDocumentation
* @module User
*/
import { DEFAULT_KEY_OPTIONS, keyOptions } from "@scripts/user/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import Toast from "@plugins/AlertToast";
import { clearErrorMsg, clearValidState, evaluateInputs, insertAlertAfter, setValidInput } from "@plugins/Required";

/**
 * Change user password
 *
 * @export
 * @class Key
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Key {

    protected options: keyOptions;

    protected modal: Modal;

    public constructor (options: keyOptions) {
        this.options = { ...DEFAULT_KEY_OPTIONS, ...options };
        this.options.id = this.options.id || +this.options.element!.getAttribute("id")!;
        this.options.name = this.options.name || this.options.element!.getAttribute("name")!;
        this.options.username = this.options.username || this.options.element!.getAttribute("username")!;
        this.modal = new Modal({
            title: `<em><b>${this.options.name}</b> | ${this.options.username}</em>`,
            size: 30,
        });
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(Router.generate(ROUTES.user.view.key));
            this.modal.updateBody(res.data);
            document.getElementById("keyForm")!.addEventListener("submit", this.validate);
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    private validate = async (e: Event) => {
        e.preventDefault();
        const BTN = document.getElementById("submit-btn")!;
        const INPUTS = Array.from(document.getElementsByClassName("required")) as HTMLInputElement[];
        clearErrorMsg();
        if (evaluateInputs(INPUTS, 5)) {
            if (INPUTS[ 0 ].value === INPUTS[ 1 ].value) {
                INPUTS.forEach(el => setValidInput(el));
                const BEF = BTN.innerHTML;
                BTN.innerHTML = SPINNER_LOADER;
                try {
                    const res = await Axios.patch(
                        Router.generate(
                            ROUTES.user.api.key, { 'id': this.options.id!.toString() }
                        ),
                        {
                            password: INPUTS[ 0 ].value
                        }
                    );
                    Toast.success(res.data);
                    this.modal.hide();
                } catch (err) {
                    insertAlertAfter(BTN, err.response ? err.response.data : err);
                    BTN.innerHTML = BEF;
                }
            } else {
                INPUTS.forEach(el => clearValidState(el));
                insertAlertAfter(BTN, "Las contraseñas no coinciden");
            }
        }
    };
}
