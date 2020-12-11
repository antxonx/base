import Modal from '@scripts/plugins/Modal';
import Axios from 'axios';
import {ROUTES, Router, SPINNER_LOADER} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import {evaluateInputs, insertAlertAfter} from '@scripts/plugins/Required';

/**
 * ClientCategoryAdd class
 *
 * @export
 * @class ClientCategoryAdd
 */
export default class ClientCategoryAdd {

    /**
     * modal
     *
     * @protected
     * @type {Modal}
     * @memberof ClientCategoryAdd
     */
    protected modal: Modal;

    /**
     * callback
     *
     * @protected
     * @memberof ClientCategoryAdd
     */
    protected callback: () => void;

    /**
     * Creates an instance of ClientCategoryAdd.
     * @param {() => void} [callback=() => {}]
     * @memberof ClientCategoryAdd
     */
    public constructor(callback: () => void = () => {}) {
        this.callback = callback;
        this.modal = (new Modal({
            title: "Nuevo cliente",
            size: 30
        }));
    }

    /**
     * load
     *
     * @memberof ClientCategoryAdd
     */
    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.clientCategory.view.form))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("clientCategoryForm")!.addEventListener("submit", this.validate);
            })
            .catch(err => {
                Toast.error(err.response.data);
                console.error(err.response.data);
                this.modal.hide();
            });
    }

    /**
     * validate
     *
     * @private
     * @memberof ClientCategoryAdd
     */
    private validate = (e: Event) => {
        e.preventDefault();
        if (evaluateInputs(
            [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>],
            0
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            BTN.innerHTML = SPINNER_LOADER;
            const DATA = {
                name: (document.getElementById("name") as HTMLInputElement).value,
                description: (document.getElementById("description") as HTMLInputElement).value,
                color: (document.getElementById("color") as HTMLInputElement).value,
            }
            Axios.post(Router.generate(ROUTES.clientCategory.api.add), DATA)
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
