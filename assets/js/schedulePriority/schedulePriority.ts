/**
* @packageDocumentation
* @module Schedule/Priority
*/
import Search from "@plugins/Search";
import { BIG_LOADER_TABLE, ROUTES, Router } from "@scripts/app";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import { SchedulePriorityOptions, DEFAULT_PRIORITY_OPTIONS } from "@scripts/schedulePriority/defs";
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";

import '@styles/table.scss';

/**
 * Client category main view and table
 *
 * @export
 * @class SchedulePriority
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class SchedulePriority {

    protected options: SchedulePriorityOptions;

    protected mainView: HTMLElement;

    protected search: string;

    protected orderBy: SortColumnOrder;

    public constructor (options?: SchedulePriorityOptions) {
        this.mainView = ((document.getElementById("prioritiesView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.orderBy = {
            column: "name",
            order: "ASC"
        };
        this.options = { ...DEFAULT_PRIORITY_OPTIONS, ...options };
        (new SortColumn({
            table: document.getElementById('priorityTable') as HTMLElement,
            callback: this.sort
        })).load();
    }

    public load = () => {
        if (this.options.control) {
            this.options.control = false;
            document.getElementById("priority-add")!.addEventListener('click', async () => {
                const { default: SchedulePriorityAdd } = await import("@scripts/schedulePriority/add");
                (new SchedulePriorityAdd(this.update)).load();
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchPriorityInput"
            });
            this.update();
        }
        Array.from(document.getElementsByClassName("priority-delete")).forEach(element => element.addEventListener("click", async () => {
            const { default: SchedulePriorityDelete } = await import("@scripts/schedulePriority/delete");
            const ELEMENT = element.closest(".priority-row") as HTMLElement;
            (new SchedulePriorityDelete({
                element: ELEMENT,
                onError: this.load
            })).delete();
        }));
        Array.from(document.getElementsByClassName("priority-show")).forEach(element => element.addEventListener("click", async () => {
            const { default: Show } = await import("@scripts/schedulePriority/show");
            const ID = +element.closest(".priority-row")!.getAttribute('id')!;
            (new Show({
                idPriority: ID,
                onClose: () => {
                    this.update();
                }
            })).load();
        }));
        Array.from(document.getElementsByClassName("priority-color")).forEach(el => el.addEventListener("click", async (e: Event) => {
            const { default: Color } = await import("./color");
            const ID = +el.closest(".priority-row")!.getAttribute('id')!;
            const ACTUAL = el.getAttribute('actual')!;
            (new Color({
                id: ID,
                actualColor: ACTUAL,
                callback: this.update
            })).load();
        }));
        return this;
    };

    private update = (page: number = 1) => {
        if (!this.options.extern) {
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "5");
            Axios.get(Router.generate(ROUTES.schedulePriority.view.list, {
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
