/**
* @packageDocumentation
* @module Client/Category
*/
import { ROUTES, Router, SPINNER_LOADER } from '@scripts/app';
import { DEFAULT_CLIENT_CATEGORY_COLOR_OPTIONS, ClientCategoryColorOptions } from "./defs";
import Modal from "@plugins/Modal";
import Toast from '@scripts/plugins/AlertToast';
import Axios from 'axios';

export default class Color {

    protected options: ClientCategoryColorOptions;

    protected modal: Modal;

    public constructor (options: ClientCategoryColorOptions) {
        this.options = { ...DEFAULT_CLIENT_CATEGORY_COLOR_OPTIONS, ...options };
        this.modal = new Modal({
            title: 'cambiar color',
            size: 30,
        });
    }

    public load = () => {
        this.modal.show();
        this.modal.updateBody(`
            <form id="colorForm">
                <div class="form-group d-flex justify-content-between">
                    <b class="text-muted font-italic">Color:&nbsp;</b><input type="color" id="color" name="color" value="${this.options.actualColor}"><span></span><span></span><span></span><span></span>
                </div>
                <div id="submit-btn" class="w-100 text-left">
                    <button type="submit" class="btn btn-large btn-antxony round w-100" id="submit-real-btn">Actualizar</button>
                </div>
            </form>
        `);
        document.getElementById("colorForm")!.addEventListener("submit", this.validate);
    };

    private validate = (e: Event) => {
        e.preventDefault();
        const COLOR = (document.getElementById("color") as HTMLInputElement).value;
        this.options.newColor = COLOR;
        const BTN = document.getElementById("submit-btn")!;
        const BEF_BTN = BTN.innerHTML;
        BTN.innerHTML = SPINNER_LOADER;
        Axios.put(Router.generate(ROUTES.clientCategory.api.color), this.options)
            .then(res => {
                Toast.success(res.data);
                this.options.callback!();
                this.modal.hide();
            })
            .catch(err => {
                BTN.innerHTML = BEF_BTN;
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    };
}
