import getSort, {SortColumn} from "@plugins/SortColumn";
import Search from "@plugins/Search";
import {BIG_LOADER_TABLE, ROUTES} from "@scripts/app";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import {ClientCategoryOptions, DEFAULT_CLIENT_CATEGORY_OPTIONS} from "@scripts/clientCategory/defs";

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
     * main
     *
     * @memberof ClientCategory
     */
    public main = () => {
        if (this.options.control) {
            this.options.control = false;
            document.getElementById("client-category-add")!.addEventListener('click', () => {
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchCategoryInput"
            });
            this.update();
        }
        [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", this.sort));
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
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "3");
            Axios.get(`${ROUTES.clientCategory.view.list}?search=${this.search}&page=${page}&ordercol=${this.orderBy.column}&orderorder=${this.orderBy.order}`)
                .then(res => {
                    this.mainView.innerHTML = res.data;
                    this.main();
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
