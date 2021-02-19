/**
* @packageDocumentation
* @module User
*/
import Modal from "@plugins/Modal";
import Axios from "axios";
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import Toast from "@plugins/AlertToast";
import { clearErrorMsg, evaluateInputs, insertAlertAfter } from "@plugins/Required";

import '@styles/checkbox.scss';

/**
 * Add a new user
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
            title: 'Nuevo usuario',
            size: 30
        });
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(Router.generate(ROUTES.user.view.form));
            this.modal.updateBody(res.data);
            document.getElementById("userForm")!.addEventListener("submit", this.validate);
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    private validate = async (e: Event) => {
        e.preventDefault();
        clearErrorMsg();
        if (evaluateInputs(
            Array.from(document.getElementsByClassName("required")) as HTMLInputElement[],
            5
        )) {
            const ROLE = Array.from(document.querySelectorAll('.check-roles:checked'));
            const BTN = document.getElementById("submit-btn")!;
            if (ROLE.length > 0) {
                const BTN_BEF = BTN.innerHTML;
                BTN.innerHTML = SPINNER_LOADER;
                try {
                    await Axios.post(
                        Router.generate(ROUTES.user.api.add),
                        {
                            username: (document.getElementById("username") as HTMLInputElement).value,
                            password: (document.getElementById("password") as HTMLInputElement).value,
                            email: (document.getElementById("email") as HTMLInputElement).value,
                            name: (document.getElementById("name") as HTMLInputElement).value,
                            roles: ROLE.map((el) => (el as HTMLInputElement).value),
                        }
                    );
                    this.callback();
                    this.modal.hide();
                } catch (err) {
                    const e = err.response ? err.response.data : err;
                    console.error(e);
                    insertAlertAfter(BTN, e);
                    BTN.innerHTML = BTN_BEF;
                }
            } else {
                insertAlertAfter(BTN, "Debe seleccionar un puesto");
            }
        }
    };
}
