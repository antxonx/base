/**
* @packageDocumentation
* @module Schedule/Category
*/

import { DEFAULT_SCHEDULE_CATEGORY_OPTIONS, ScheduleCategoryOptions } from "./defs";
import { SortColumnOrder } from "@scripts/plugins/SortColumn/defs";
import SortColumn from "@scripts/plugins/SortColumn";
import Axios from "axios";
import { BIG_LOADER_TABLE, Router, ROUTES } from "@scripts/app";
import Paginator from "@scripts/plugins/Paginator";
import Toast from "@scripts/plugins/AlertToast";
import Search from "@scripts/plugins/Search";
import ScheduleCategoryAdd from "./add";
import ScheduleCategoryDelete from "./delete";
import Show from "./show";

export default class ScheduleCategory {

    protected options: ScheduleCategoryOptions

    protected mainView: HTMLElement;

    protected search: string;

    protected orderBy: SortColumnOrder;

    public constructor(options?: ScheduleCategoryOptions){
        this.mainView = ((document.getElementById("scheduleCategoriesView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.orderBy = {
            column: "name",
            order: "ASC"
        }
        this.options = {...DEFAULT_SCHEDULE_CATEGORY_OPTIONS, ...options};
        (new SortColumn({
            table: document.getElementById('scheduleCategoryTable') as HTMLElement,
            callback: this.sort
        })).load();
    }

    public load = () => {
        if (this.options.control) {
            this.options.control = false;
            document.getElementById("schedule-category-add")!.addEventListener('click', () => {
                (new ScheduleCategoryAdd(this.update)).load();
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchScheduleCategoryInput"
            });
            this.update();
        }
        [...document.getElementsByClassName("category-delete")].forEach(element => element.addEventListener("click", (e: Event) => {
            (new ScheduleCategoryDelete({
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

    private update = (page: number = 1) => {
        if (!this.options.extern) {
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "5");
            Axios.get(Router.generate(ROUTES.scheduleCategory.view.list, {
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

    private setSearch = (data: string) => {
        this.search = data;
        this.update();
    }

    private sort = (order: SortColumnOrder) => {
        this.orderBy = order;
        this.update();
    }

}
