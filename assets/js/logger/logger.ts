/**
* @packageDocumentation
* @module Logger
*/
import Axios from 'axios';
import Paginator from '@scripts/plugins/Paginator';
import Search from '@scripts/plugins/Search';
import Toast from '@scripts/plugins/AlertToast';
import {BIG_LOADER_TABLE, Router, ROUTES} from '@scripts/app';
import ButtonCheckGroup from '@plugins/ButtonCheckGroup';
import {SortColumnOrder} from "@plugins/SortColumn/defs";
import SortColumn from "@plugins/SortColumn";

/**
 * Logger main biew and table
 *
 * @export
 * @class Logger
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Logger {

    protected control: boolean

    protected view: HTMLElement;

    protected searchInput: string;

    protected method: string;

    protected route: string|null;

    protected orderBy: SortColumnOrder;

    protected readonly defaultView = `<tr class="table-paginator"><td colspan="6"><div class="alert alert-info w-50-c mx-auto mt-lg-5 round text-center">Debe selecionar un tipo de regsitro</div></td></tr>`;

    public constructor() {
        this.control = true;
        this.searchInput = '';
        this.method = '';
        this.route = null;
        this.view = ((document.getElementById("logsView") as HTMLElement) || document.createElement("div"));
        this.orderBy = {
            column: "createdAt",
            order: "DESC"
        };
        (new SortColumn({
            table: document.getElementById('loggerTable') as HTMLElement,
            callback: this.sort,
        })).load();
    }

    public load = () => {
        if(this.control) {
            this.control = false;
            this.updateView(this.defaultView);
            new Search({
                callback: this.searchField,
                selector: "#searchLogInput"
            });
            new ButtonCheckGroup(document.getElementById('logSwitch') as HTMLElement, {
                onChange: this.changeType,
                unCheckClass: 'btn-outline-success',
                checkClass: 'btn-success',
                extraClass: 'round'
            });
        }
        document.getElementById("methodSelect")!.addEventListener("input", this.changeMethod);
    };

    private searchField = (data: string) => {
        this.searchInput = data.replace(/\//g, "_");
        this.update();
    };

    private update = (page: number = 1) => {
        if (this.route != null) {
            this.updateView(BIG_LOADER_TABLE.replace("0", "6"));
            const USER = (document.getElementById("registerUser") as HTMLInputElement).value;
            Axios.get(Router.generate(this.route, {
                'search': this.searchInput,
                'page': page,
                'method': this.method,
                'ordercol': this.orderBy.column,
                'orderorder': this.orderBy.order,
                'user': USER
            }))
                .then(res => {
                    this.updateView(res.data);
                    this.load();
                    new Paginator({callback: this.update});
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                });
        } else {
            this.updateView(this.defaultView);
        }
    }

    private changeType = (value: string[]) => {
        if (value.includes('info')) {
            this.route = ROUTES.logger.view.info;
        } else if (value.includes('error')) {
            this.route = ROUTES.logger.view.error;
        } else {
            this.route = null;
        }
        this.update();
    };

    private sort = (order: SortColumnOrder) => {
        this.orderBy = order;
        this.update();
    }

    private changeMethod = (e: Event) => {
        this.method = (e.currentTarget as HTMLInputElement).value;
        this.update();
    }

    private updateView = (newView : string) => {
        this.view.innerHTML = newView;
    }
}
