import getSort, {SortColumn} from "@plugins/SortColumn";
import Search from "@plugins/Search";
import {BIG_LOADER_TABLE, Router, ROUTES} from "@scripts/app";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import Add from "@scripts/client/add";
import Delete from "@scripts/client/delete";
import Show from "@scripts/client/show";

/**
 * Client class
 *
 * @export
 * @class Client
 */
export default class Client {
    protected mainView: HTMLElement;
    protected search: string;
    protected orderBy: SortColumn
    protected control: boolean
    public constructor() {
        this.search = '';
        this.mainView = (document.getElementById("clientsView") || document.createElement("div"));
        this.control = true;
        this.orderBy = {
            column: "name",
            order: "ASC"
        }
    }

    /**
     * load
     *
     * @memberof Client
     */
    public load = () => {
        if (this.control) {
            document.getElementById("client-add")?.addEventListener("click", this.add);
            new Search({
                callback: this.setSearch,
                selector: "#searchClientInput"
            });
            this.update();
            this.control = false;
        }
        [...document.getElementsByClassName("client-delete")].forEach(element => element.addEventListener("click", this.delete));
        [...document.getElementsByClassName("client-show")].forEach(element => element.addEventListener("click", this.show));
        [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", this.sort));
    }

    /**
     * update
     *
     * @private
     * @memberof Client
     */
    private update = (page: number = 1) => {
        this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "5");
        Axios.get(Router.generate(ROUTES.client.view.list, {
            'search': this.search,
            'page': page,
            'ordercol': this.orderBy.column,
            'orderorder': this.orderBy.order
        }))
            .then(res => {
                this.mainView.innerHTML = res.data;
                this.load();
                new Paginator({callback: this.update});
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    }

    /**
     * setSearch
     *
     * @private
     * @memberof Client
     */
    private setSearch = (data: string) => {
        this.search = data;
        this.update();
    }

    private add = () => {
        (new Add(this.load)).load();
    }

    /**
     * delete
     *
     * @private
     * @memberof Client
     */
    private delete = (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".client-row") as HTMLElement;
        (new Delete({
            element: ELEMENT,
            onError: this.load
        })).delete();
    }

    /**
     * show
     *
     * @private
     * @memberof Client
     */
    private show = (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".client-row")!;
        //showClient(+ELEMENT.getAttribute("id")!, this.load);
        (new Show({
            id: +ELEMENT.getAttribute("id")!,
            callback: this.update
        })).load();
    }

    /**
     * sort
     *
     * @private
     * @memberof Client
     */
    private sort = (e: Event) => {
        this.orderBy = getSort(e.currentTarget as HTMLElement);
        this.update();
    }
}
