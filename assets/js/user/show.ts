import {DEFAULT_EDIT_OPTIONS, EditOptions} from "@scripts/user/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import {Router, ROUTES} from "@scripts/app";
import Toast from "@plugins/AlertToast";

/**
 * Show
 *
 * @export
 * @class Show
 */
export default class Show {

    /**
     * options
     *
     * @protected
     * @type {EditOptions}
     * @memberof Show
     */
    protected options: EditOptions;

    /**
     * modal
     *
     * @protected
     * @type {Modal}
     * @memberof Show
     */
    protected modal: Modal;

    /**
     * Creates an instance of Show.
     * @param {EditOptions} options
     * @memberof Show
     */
    public constructor(options: EditOptions) {
        this.options = {...DEFAULT_EDIT_OPTIONS, ...options};
        if (this.options.id === 0) {
            throw new Error("No se ha podido determinar al usuario");
        }
        this.modal = new Modal({
            title: 'Usuario',
            size: 50
        });
    }

    /**
     * load
     *
     * @memberof Show
     */
    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.user.view.show, {'id': this.options.id.toString()}))
            .then(res => {
                this.modal.updateBody(res.data);
                $('.editable-field').editable({
                    success: (res: any) => {
                        Toast.success(res);
                        this.options.callback!();
                    },
                    error: (err: any) => {
                        console.error(err.responseText);
                        Toast.error(err.responseText);
                    },
                    disabled: true
                });
                document.getElementById("user-edit-active")!.addEventListener("click", this.toggle);
            })
            .catch(err => {
                console.error(err);
                Toast.error(err.response.data);
            });
    }

    /**
     * toggle
     *
     * @private
     * @memberof Show
     */
    private toggle = (e: Event) => {
        const BTN = (e.currentTarget as HTMLElement);
        if (!!(+BTN.getAttribute("active")!)) {
            BTN.setAttribute("active", "0");
            BTN.classList.remove("btn-danger");
            BTN.classList.add("btn-warning");
            BTN.innerHTML = "Editar";
        } else {
            BTN.setAttribute("active", "1");
            BTN.classList.remove("btn-warning");
            BTN.classList.add("btn-danger");
            BTN.innerHTML = "Cancelar";
        }
        $('.editable-field').editable('toggleDisabled');
    }
}
