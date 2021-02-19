/**
* @packageDocumentation
* @module User
*/
import ButtonCheck from "@plugins/ButtonCheckGroup";
import { BIG_LOADER_TABLE, Router, ROUTES } from "@scripts/app";
import Search from "@plugins/Search";
import Axios from "axios";
import Paginator from "@plugins/Paginator";
import Toast from "@plugins/AlertToast";
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";

import '@styles/table.scss';

/**
 * User main view and table
 *
 * @export
 * @class User
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class User {

    protected control: boolean;

    protected mainView: HTMLElement;

    protected search: string;

    protected suspended: number;

    protected orderBy: SortColumnOrder;

    protected page: number;

    public constructor () {
        this.mainView = ((document.getElementById("usersView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.suspended = 0;
        this.page = 1;
        this.orderBy = {
            column: "name",
            order: "ASC"
        };
        this.control = true;
        (new SortColumn({
            table: document.getElementById('userTable') as HTMLElement,
            callback: this.sort
        })).load();
    }

    public load = () => {
        if (this.control) {
            document.getElementById("user-add")!.addEventListener("click", this.add);
            new ButtonCheck(document.getElementById("suspendedFilter") as HTMLButtonElement, {
                onChange: this.setSuspended,
                unCheckClass: 'btn-outline-success',
                checkClass: 'btn-success',
                extraClass: 'round'
            });
            new Search({
                callback: this.setSearch,
                selector: "#searchUserInput"
            });
            this.control = false;
            this.update();
        }
        Array.from(document.getElementsByClassName("user-delete")).forEach(
            element => element.addEventListener("click", this.delete)
        );
        Array.from(document.getElementsByClassName("user-password")).forEach(
            element => element.addEventListener("click", this.key)
        );
        Array.from(document.getElementsByClassName("user-edit")).forEach(
            element => element.addEventListener("click", this.show)
        );
        Array.from(document.getElementsByClassName("user-reactivate")).forEach(
            element => element.addEventListener("click", this.reactive)
        );
    };

    private update = async (page: number = 1, spinner = true) => {
        this.page = page;
        spinner && (this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "9"));

        try {
            const res = await Axios.get(
                Router.generate(ROUTES.user.view.list, {
                    'search': this.search,
                    'page': this.page,
                    'suspended': this.suspended,
                    'ordercol': this.orderBy.column,
                    'orderorder': this.orderBy.order,
                })
            );
            this.mainView.innerHTML = res.data;
            this.load();
            new Paginator({ callback: this.update });
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    private add = async () => {
        const { default: Add } = await import("@scripts/user/add");
        (new Add(this.load)).load();
    };

    private setSuspended = (value: string[]) => {
        this.suspended = +value.includes('suspended');
        this.update();
    };

    private setSearch = (data: string) => {
        this.search = data;
        this.update();
    };

    private delete = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        const { default: Delete } = await import("@scripts/user/delete");
        (new Delete({
            element: ELEMENT,
        })).delete();
    };

    private reactive = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        const { default: Delete } = await import("@scripts/user/delete");
        (new Delete({
            element: ELEMENT,
        })).reactive();
    };

    private show = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        const ID = +ELEMENT.getAttribute("id")!;
        const { default: Show } = await import("@scripts/user/show");
        (new Show({
            id: ID,
            callback: () => {
                this.update(this.page, false);
            }
        })).load();
    };

    private key = async (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        const { default: Key } = await import("@scripts/user/key");
        (new Key({
            element: ELEMENT
        })).load();

    };

    private sort = (order: SortColumnOrder) => {
        this.orderBy = order;
        this.update();
    };
}
