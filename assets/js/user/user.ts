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
import Add from "@scripts/user/add";
import Delete from "@scripts/user/delete";
import Key from "@scripts/user/key";
import Show from "@scripts/user/show";
import { SortColumnOrder } from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";

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

    public constructor () {
        this.mainView = ((document.getElementById("usersView") as HTMLElement) || document.createElement("div"));
        this.search = "";
        this.suspended = 0;
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
        [ ...document.getElementsByClassName("user-delete") ].forEach(
            element => element.addEventListener("click", this.delete)
        );
        [ ...document.getElementsByClassName("user-password") ].forEach(
            element => element.addEventListener("click", this.key)
        );
        [ ...document.getElementsByClassName("user-edit") ].forEach(
            element => element.addEventListener("click", this.show)
        );
        [ ...document.getElementsByClassName("user-reactivate") ].forEach(
            element => element.addEventListener("click", this.reactive)
        );
    };

    private update = (page: number = 1) => {
        this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "9");
        Axios.get(Router.generate(ROUTES.user.view.list, {
            'search': this.search,
            'page': page,
            'suspended': this.suspended,
            'ordercol': this.orderBy.column,
            'orderorder': this.orderBy.order,
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
    };

    private add = () => {
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

    private delete = (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        (new Delete({
            element: ELEMENT,
        })).delete();
    };

    private reactive = (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        (new Delete({
            element: ELEMENT,
        })).reactive();
    };

    private show = (e: Event) => {
        const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
        (new Show({
            id: +ELEMENT.getAttribute("id")!,
            callback: this.update
        })).load();
    };

    private key = (e: Event) => {
        (new Key({
            element: (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement
        })).load();

    };

    private sort = (order: SortColumnOrder) => {
        this.orderBy = order;
        this.update();
    };
}
