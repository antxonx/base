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
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";

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
            document.getElementById("client-category-add")!.addEventListener('click', async () => {
                const { default: ClientCategoryAdd } = await import("@scripts/clientCategory/add");
                (new ClientCategoryAdd(this.update)).load();
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchCategoryInput"
            });
            this.update();
        }
        Array.from(document.getElementsByClassName("catgeory-delete")).forEach(element => element.addEventListener("click", async () => {
            const { default: ClientCategoryDelete } = await import("@scripts/clientCategory/delete");
            const ELEMENT = element.closest(".category-row") as HTMLElement;
            (new ClientCategoryDelete({
                element: ELEMENT,
                onError: this.load
            })).delete();
        }));
        Array.from(document.getElementsByClassName("category-show")).forEach(element => element.addEventListener("click", async () => {
            const { default: Show } = await import("@scripts/clientCategory/show");
            const ID = +element.closest(".category-row")!.getAttribute('id')!;
            (new Show({
                idCategory: ID,
                onClose: () => {
                    this.update();
                }
            })).load();
        }));
        Array.from(document.getElementsByClassName("category-color")).forEach(el => el.addEventListener("click",
            async () => {
                const { default: Color } = await import("./color");
                const ID = +el.closest(".category-row")!.getAttribute('id')!;
                const ACTUAL = el.getAttribute('actual')!;
                (new Color({
                    id: ID,
                    actualColor: ACTUAL,
                    callback: this.update
                })).load();
            }
        ));
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
