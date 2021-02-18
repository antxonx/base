/**
* @packageDocumentation
* @module Client/Category
*/
import Search from "@plugins/Search";
import { BIG_LOADER_TABLE, ROUTES, Router } from "@scripts/app";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import { ClientCategoryOptions, DEFAULT_CLIENT_CATEGORY_OPTIONS } from "@scripts/clientCategory/defs";
import ClientCategoryAdd from "@scripts/clientCategory/add";
import ClientCategoryDelete from "@scripts/clientCategory/delete";
import Show from "@scripts/clientCategory/show";
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";
import Color from "./color";

/**
 * Client category main view and table
 *
 * @export
 * @class ClientCategory
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class ClientCategory {

    protected options: ClientCategoryOptions;

    protected mainView: HTMLElement;

    protected search: string;

    protected orderBy: SortColumnOrder;

    public constructor (options?: ClientCategoryOptions) {
        this.mainView = ((document.getElementById("clientCategoriesView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.orderBy = {
            column: "name",
            order: "ASC"
        };
        this.options = { ...DEFAULT_CLIENT_CATEGORY_OPTIONS, ...options };
        (new SortColumn({
            table: document.getElementById('clientCategoryTable') as HTMLElement,
            callback: this.sort
        })).load();
    }

    public load = () => {
        if (this.options.control) {
            this.options.control = false;
            document.getElementById("client-category-add")!.addEventListener('click', () => {
                (new ClientCategoryAdd(this.update)).load();
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchCategoryInput"
            });
            this.update();
        }
        Array.from(document.getElementsByClassName("catgeory-delete")).forEach(element => element.addEventListener("click", (e: Event) => {
            (new ClientCategoryDelete({
                element: (e.currentTarget as HTMLElement).closest(".category-row") as HTMLElement,
                onError: this.load
            })).delete();
        }));
        Array.from(document.getElementsByClassName("category-show")).forEach(element => element.addEventListener("click", (e: Event) => {
            (new Show({
                idCategory: +(e.currentTarget as HTMLElement).closest(".category-row")!.getAttribute('id')!,
                onClose: () => {
                    this.update();
                }
            })).load();
        }));
        Array.from(document.getElementsByClassName("category-color")).forEach(el => el.addEventListener("click", (e: Event) => {
            (new Color({
                id: +(e.currentTarget as HTMLElement).closest(".category-row")!.getAttribute('id')!,
                actualColor: (e.currentTarget as HTMLElement).getAttribute('actual')!,
                callback: this.update
            })).load();
        }));
        return this;
    };

    private update = (page: number = 1) => {
        if (!this.options.extern) {
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "5");
            Axios.get(Router.generate(ROUTES.clientCategory.view.list, {
                'search': this.search,
                'page': page,
                'ordercol': this.orderBy.column,
                'orderorder': this.orderBy.order
            }))
                .then(res => {
                    this.mainView.innerHTML = res.data;
                    this.load();
                    new Paginator({ callback: this.update });
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                });
        }
    };

    private setSearch = (data: string) => {
        this.search = data;
        this.update();
    };

    private sort = (order: SortColumnOrder) => {
        this.orderBy = order;
        this.update();
    };
}
