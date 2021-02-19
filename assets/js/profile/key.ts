/**
* @packageDocumentation
* @module Profile
*/
import Modal from "@plugins/Modal";
import Axios, { AxiosError, AxiosResponse } from "axios";
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import Toast from "@plugins/AlertToast";
import { clearErrorMsg, clearValidState, evaluateInputs, insertAlertAfter, setValidInput } from "@plugins/Required";
import { PASSWORD_INPUT } from "@scripts/profile/defs";

/**
 * Change user password with confirmation
 *
 * @export
 * @class Key
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Key {

    protected modal: Modal;

    public constructor () {
        this.modal = new Modal({
            title: 'CAmbiar contraseña',
            size: 30
        });
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(Router.generate(ROUTES.user.view.passform));
            this.modal.updateBody(res.data);
            document.getElementById('passForm')!.addEventListener('submit', this.validate);
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    public validate = async (e: Event) => {
        e.preventDefault();
        const BTN = document.getElementById("submit-btn")!;
        const INPUTS = Array.from(document.getElementsByClassName("required")) as HTMLInputElement[];
        clearErrorMsg();
        if (evaluateInputs(INPUTS, 5)) {
            if (INPUTS[ PASSWORD_INPUT.NEW ].value === INPUTS[ PASSWORD_INPUT.CONF ].value) {
                const BEF = BTN.innerHTML;
                BTN.innerHTML = SPINNER_LOADER;
                setValidInput(INPUTS[ PASSWORD_INPUT.NEW ]);
                setValidInput(INPUTS[ PASSWORD_INPUT.CONF ]);
                try {
                    const res = await Axios.put(
                        Router.generate(ROUTES.user.api.passchange),
                        {
                            old: INPUTS[ PASSWORD_INPUT.OLD ].value,
                            new: INPUTS[ PASSWORD_INPUT.NEW ].value,
                            conf: INPUTS[ PASSWORD_INPUT.CONF ].value,
                        }
                    );
                    Toast.success(res.data);
                    this.modal.hide();
                } catch (err) {
                    insertAlertAfter(BTN, err.response?.data);
                    BTN.innerHTML = BEF;
                }
            } else {
                clearValidState(INPUTS[ PASSWORD_INPUT.NEW ]);
                clearValidState(INPUTS[ PASSWORD_INPUT.CONF ]);
                insertAlertAfter(BTN, "Las contraseñas no coinciden");
            }
        }
    };
}
