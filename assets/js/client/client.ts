/**
* @packageDocumentation
* @module Client
*/
import Search from "@plugins/Search";
import 'bootstrap/js/dist/tooltip';
import { BIG_LOADER_TABLE, Router, ROUTES } from "@scripts/app";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";

import '@styles/table.scss';

/**
 * Controls the main view and table actions of clients
 *
 * @export
 * @class Client
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Client {

    protected mainView: HTMLElement;

    protected search: string;

    protected orderBy: SortColumnOrder;

    protected category: number;

    protected control: boolean;

    protected page: number;

    public constructor () {
        this.search = '';
        this.category = 0;
        this.mainView = (document.getElementById("clientsView") || document.createElement("div"));
        this.control = true;
        this.page = 1;
        this.orderBy = {
            column: "name",
            order: "ASC"
        };
        (new SortColumn({
            table: document.getElementById('clientTable') as HTMLElement,
            callback: this.sort
        })).load();
    }

    public load = () => {
        if (this.control) {
            document.getElementById("client-add")?.addEventListener("click", this.add);
            document.getElementById("categorySelect")?.addEventListener("change", this.setCategory);
            new Search({
                callback: this.setSearch,
                selector: "#searchClientInput"
            });
            this.update();
            this.control = false;
        }
        Array.from(document.getElementsByClassName("client-delete")).forEach(element => element.addEventListener("click", this.delete));
        Array.from(document.getElementsByClassName("client-show")).forEach(element => element.addEventListener("click", this.show));
        Array.from(document.getElementsByClassName("client-add-obs")).forEach(element => element.addEventListener("click", async () => {
            const ID = +element.closest(".client-row")!.getAttribute("id")!;
            const { default: Obs } = await import("@scripts/plugins/Obs");
            const { default: Modal } = await import("@scripts/plugins/Modal");
            const OBS_MODAL = (new Modal({
                size: 50,
                title: "Observaciones",
            })).show();
            (new Obs({
                element: OBS_MODAL.getBodyElement(),
                entity: "Client",
                id: ID,
                callback: () => {
                    this.update(this.page, false);
                },
            })).load();
        }));
    };

    private update = (page: number = 1, spinner = true) => {
        this.page = page;
        if(spinner)
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "5");
        Axios.get(Router.generate(ROUTES.client.view.list, {
            'search': this.search,
            'page': this.page,
            'ordercol': this.orderBy.column,
            'orderorder': this.orderBy.order,
            'category': this.category,
        }))
            .then(res => {
                this.mainView.innerHTML = res.data;
                $('[data-toggle="tooltip"]').tooltip();
                this.load();
                new Paginator({ callback: this.update });
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    };

    private setSearch = (data: string) => {
        this.search = data;
        this.update();
    };

    private add = async () => {
        const { default: Add } = await import("@scripts/client/add");
        (new Add(this.load)).load();
    };

    private delete = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".client-row") as HTMLElement;
        const { default: Delete } = await import("@scripts/client/delete");
        (new Delete({
            element: ELEMENT,
            onError: this.load
        })).delete();
    };

    private show = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".client-row")!;
        const ID = +ELEMENT.getAttribute("id")!;
        const { default: Show } = await import("@scripts/client/show");
        (new Show({
            id: ID,
            callback: () => {
                this.update(this.page, false);
            }
        })).load();
    };

    private sort = (order: SortColumnOrder) => {
        this.orderBy = order;
        this.update();
    };

    private setCategory = (e: Event) => {
        this.category = +(e.currentTarget as HTMLInputElement).value;
        this.update();
    };
}