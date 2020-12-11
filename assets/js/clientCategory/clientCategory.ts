import getSort, {SortColumn} from "@plugins/SortColumn";
import Search from "@plugins/Search";
import {BIG_LOADER_TABLE, ROUTES, Router} from "@scripts/app";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import {ClientCategoryOptions, DEFAULT_CLIENT_CATEGORY_OPTIONS} from "@scripts/clientCategory/defs";
import ClientCategoryAdd from "@scripts/clientCategory/add";
import ClientCategoryDelete from "@scripts/clientCategory/delete";
import Show from "@scripts/clientCategory/show";

/**
 * ClientCategory class
 *
 * @export
 * @class ClientCategory
 */
export default class ClientCategory {

    /**
     * options
     *
     * @protected
     * @type {ClientCategoryOptions}
     * @memberof ClientCategory
     */
    protected options: ClientCategoryOptions

    /**
     * mainView
     *
     * @protected
     * @type {HTMLElement}
     * @memberof ClientCategory
     */
    protected mainView: HTMLElement;

    /**
     * search
     *
     * @protected
     * @type {string}
     * @memberof ClientCategory
     */
    protected search: string;

    /**
     * orderBy
     *
     * @protected
     * @type {SortColumn}
     * @memberof ClientCategory
     */
    protected orderBy: SortColumn;

    /**
     * Creates an instance of ClientCategory.
     * @param {ClientCategoryOptions} [options]
     * @memberof ClientCategory
     */
    public constructor(options?: ClientCategoryOptions) {
        this.mainView = ((document.getElementById("clientCategoriesView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.orderBy = {
            column: "name",
            order: "ASC"
        }
        this.options = {...DEFAULT_CLIENT_CATEGORY_OPTIONS, ...options};
    }

    /**
     * load
     *
     * @memberof ClientCategory
     */
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
        [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", this.sort));
        [...document.getElementsByClassName("catgeory-delete")].forEach(element => element.addEventListener("click", (e: Event) => {
            (new ClientCategoryDelete({
                element: (e.currentTarget as HTMLElement).closest(".category-row") as HTMLElement,
                onError: this.load
            })).delete();
        }));
        [...document.getElementsByClassName("category-show")].forEach(element => element.addEventListener("click", (e: Event) => {
            (new Show({
                idCategory: +(e.currentTarget as HTMLElement).closest(".category-row")!.getAttribute('id')!,
                onClose: () => {
                    this.update();
                }
            })).load();
        }));
        return this;
    }

    /**
     * update
     *
     * @private
     * @memberof ClientCategory
     */
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
                    new Paginator({callback: this.update});
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                });
        }
    }

    /**
     * set search
     *
     * @private
     * @memberof ClientCategory
     */
    private setSearch = (data: string) => {
        this.search = data;
        this.update();
    }

    /**
     * sort
     *
     * @private
     * @memberof ClientCategory
     */
    private sort = (e: Event) => {
        this.orderBy = getSort(e.currentTarget as HTMLElement);
        this.update();
    }
}
