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
import SchedulePriorityAdd from "@scripts/schedulePriority/add";
import SchedulePriorityDelete from "@scripts/schedulePriority/delete";
import Show from "@scripts/schedulePriority/show";
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";
import Color from "./color";
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
            document.getElementById("priority-add")!.addEventListener('click', () => {
                (new SchedulePriorityAdd(this.update)).load();
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchPriorityInput"
            });
            this.update();
        }
        Array.from(document.getElementsByClassName("priority-delete")).forEach(element => element.addEventListener("click", (e: Event) => {
            (new SchedulePriorityDelete({
                element: (e.currentTarget as HTMLElement).closest(".priority-row") as HTMLElement,
                onError: this.load
            })).delete();
        }));
        Array.from(document.getElementsByClassName("priority-show")).forEach(element => element.addEventListener("click", (e: Event) => {
            (new Show({
                idPriority: +(e.currentTarget as HTMLElement).closest(".priority-row")!.getAttribute('id')!,
                onClose: () => {
                    this.update();
                }
            })).load();
        }));
        Array.from(document.getElementsByClassName("priority-color")).forEach(el => el.addEventListener("click", (e: Event) => {
            (new Color({
                id: +(e.currentTarget as HTMLElement).closest(".priority-row")!.getAttribute('id')!,
                actualColor: (e.currentTarget as HTMLElement).getAttribute('actual')!,
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
