import $ from 'jquery';
import 'bootstrap';
import {ClientCategoryChangeOptions, DEFAULT_CLIENT_CATEGORY_CHANGE_OPTIONS} from "@scripts/clientCategory/defs";
import Modal from "@plugins/Modal";
import Axios from "axios";
import {ROUTES} from "@scripts/app";
import ListSelect from "@plugins/ListSelect";

export default class ChangeCategory
{
    protected options: ClientCategoryChangeOptions;

    protected modal : Modal;

    public constructor(options : ClientCategoryChangeOptions) {
        this.options = {...DEFAULT_CLIENT_CATEGORY_CHANGE_OPTIONS, ...options};
        this.modal = new Modal({
            title: "Cambiar de categoría",
            size: 50,
            onHide: this.options.onClose
        });
        if(this.options.idClient == 0) {
            throw new Error("No se ha podido identificar al cliente");
        }
    }

    public load(){
        this.modal.show();
        Axios.get(ROUTES.clientCategory.view.changeForm.replace('0', this.options.idClient.toString()))
            .then(res => {
               this.modal.updateBody(res.data);
               $('[data-toggle="tooltip"]').tooltip();
                (new ListSelect({
                  element: document.getElementById('categoryList') as HTMLElement,
                  multiple: false,
                  attribute: 'category-id',
                  callback: this.listchange
              })).load();
            })
            .catch(err => {
                this.modal.hide();
                throw new Error(err.response.data);
            });
    }

    private listchange = (data : string[]) => {
        console.log(data);
    }
}
