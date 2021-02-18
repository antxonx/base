/**
* @packageDocumentation
* @module Schedule/Category
*/

import { DEFAULT_SCHEDULE_CATEGORY_OPTIONS, ScheduleCategoryOptions } from "./defs";
import { SortColumnOrder } from "@scripts/plugins/SortColumn/defs";
import SortColumn from "@scripts/plugins/SortColumn";
import Axios from "axios";
import { BIG_LOADER_TABLE, ConfigTypes, Router, ROUTES } from "@scripts/app";
import Paginator from "@scripts/plugins/Paginator";
import Toast from "@scripts/plugins/AlertToast";
import Search from "@scripts/plugins/Search";
import ButtonCheckGroup from "@scripts/plugins/ButtonCheckGroup";
import Config from "@scripts/configuration";

export default class ScheduleCategory {

    protected options: ScheduleCategoryOptions;

    protected mainView: HTMLElement;

    protected search: string;

    protected orderBy: SortColumnOrder;

    public constructor (options?: ScheduleCategoryOptions) {
        this.mainView = ((document.getElementById("scheduleCategoriesView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.orderBy = {
            column: "name",
            order: "ASC"
        };
        this.options = { ...DEFAULT_SCHEDULE_CATEGORY_OPTIONS, ...options };
        (new SortColumn({
            table: document.getElementById('scheduleCategoryTable') as HTMLElement,
            callback: this.sort
        })).load();
    }

    public load = () => {
        if (this.options.control) {
            this.options.control = false;
            document.getElementById("schedule-category-add")!.addEventListener('click', async () => {
                const { default: ScheduleCategoryAdd } = await import("./add");
                (new ScheduleCategoryAdd(this.update)).load();
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchScheduleCategoryInput"
            });
            new ButtonCheckGroup(document.getElementById('extraCheck') as HTMLElement, {
                onChange: () => { },
                unCheckClass: 'btn-outline-info',
                checkClass: 'btn-info',
                extraClass: 'round'
            });
            document.getElementById("obsBorderForm")!.addEventListener("click", () => {
                (new Config({
                    type: ConfigTypes.TaskCommentedBorder
                })).load();
            });
            document.getElementById("recBorderForm")!.addEventListener("click", () => {
                (new Config({
                    type: ConfigTypes.TaskRecurrentBorder
                })).load();
            });
            document.getElementById("doneTaskForm")!.addEventListener("click", () => {
                (new Config({
                    type: ConfigTypes.TaskDoneColors
                })).load();
            });
            document.getElementById("obsBorderRestore")!.addEventListener("click", () => {
                (new Config({
                    type: ConfigTypes.TaskCommentedBorder,
                    restore: true,
                    callback: () => {
                        window.location.reload();
                    }
                })).load();
            });
            document.getElementById("recBorderRestore")!.addEventListener("click", () => {
                (new Config({
                    type: ConfigTypes.TaskRecurrentBorder,
                    restore: true,
                    callback: () => {
                        window.location.reload();
                    }
                })).load();
            });
            document.getElementById("doneTaskRestore")!.addEventListener("click", () => {
                (new Config({
                    type: ConfigTypes.TaskDoneColors,
                    restore: true,
                    callback: () => {
                        window.location.reload();
                    }
                })).load();
            });
            this.update();
        }
        Array.from(document.getElementsByClassName("category-delete")).forEach(element => element.addEventListener("click", async () => {
            const { default: ScheduleCategoryDelete } = await import("./delete");
            const ELEMENT = element.closest(".category-row") as HTMLElement;
            (new ScheduleCategoryDelete({
                element: ELEMENT,
                onError: this.load
            })).delete();
        }));
        Array.from(document.getElementsByClassName("category-show")).forEach(element => element.addEventListener("click", async () => {
            const { default: Show } = await import("./show");
            const ID = +element.closest(".category-row")!.getAttribute('id')!;
            (new Show({
                idCategory: ID,
                onClose: () => {
                    this.update();
                }
            })).load();
        }));
        Array.from(document.getElementsByClassName("category-color")).forEach(el => el.addEventListener("click", async (e: Event) => {
            const { default: Color } = await import("./color");
            const ID = +el.closest(".category-row")!.getAttribute('id')!;
            const TYPE = (el.getAttribute('type')! as 'background' | 'text');
            const ACTUAL = el.getAttribute('actual')!;
            (new Color({
                id: ID,
                type: TYPE,
                actualColor: ACTUAL,
                callback: this.update
            })).load();
        }));
        return this;
    };

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
