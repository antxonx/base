/**
* @packageDocumentation
* @module Schedule/Category
*/
import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import { ROUTES, Router, SPINNER_LOADER } from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import { evaluateInputs, insertAlertAfter } from '@scripts/plugins/Required';

import '@styles/checkbox.scss';

/**
 * Add a new category for events on scheduler
 *
 * @export
 * @class ScheduleCategoryAdd
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class ScheduleCategoryAdd {

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
            const res = await Axios.get(Router.generate(ROUTES.scheduleCategory.view.form));
            this.modal.updateBody(res.data);
            document.getElementById("scheduleCategoryForm")!.addEventListener("submit", this.validate);
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
            const ROLE = Array.from(document.querySelectorAll('.check-roles:checked'));
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            const DATA = {
                name: (document.getElementById("name") as HTMLInputElement).value,
                description: (document.getElementById("description") as HTMLInputElement).value,
                bColor: (document.getElementById("bColor") as HTMLInputElement).value,
                tColor: (document.getElementById("tColor") as HTMLInputElement).value,
                roles: ROLE.map((el) => (el as HTMLInputElement).value),
            };
            try {
                const res = await Axios.post(Router.generate(ROUTES.scheduleCategory.api.add), DATA);
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
