import Axios from 'axios';
import Paginator from '@scripts/plugins/Paginator';
import Search from '@scripts/plugins/Search';
import Toast from '@scripts/plugins/AlertToast';
import {BIG_LOADER, BIG_LOADER_TABLE, Router, ROUTES} from '@scripts/app';
import ButtonCheckGroup from '@plugins/ButtonCheckGroup';
import getSort, {SortColumn} from '@scripts/plugins/SortColumn';

/**
 * Logger Class
 *
 * @export
 * @class Logger
 */
export default class Logger {
    /**
     * mainView
     *
     * @private
     * @type {HTMLElement}
     * @memberof Logger
     */
    private mainView: HTMLElement;

    /**
     * searchInput
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private searchInput: string;

    /**
     * method
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private method: string;

    /**
     * route
     *
     * @private
     * @type {string}
     * @memberof Logger
     */
    private route: string;

    /**
     * order by
     *
     * @private
     * @type {SortColumn}
     * @memberof Logger
     */
    private orderBy: SortColumn;

    /**
     * default view
     *
     * @private
     * @memberof Logger
     */
    private readonly defaultView = `<tr class="table-paginator"><td colspan="6"><div class="alert alert-info w-50-c mx-auto mt-lg-5 round text-center">Debe selecionar un tipo de regsitro</div></td></tr>`;

    /**
     * Creates an instance of Logger.
     * @memberof Logger
     */
    public constructor() {
        this.searchInput = '';
        this.method = '';
        this.route = '';
        this.mainView = ((document.getElementById("logsView") as HTMLElement) || document.createElement("div"));
        this.orderBy = {
            column: "createdAt",
            order: "DESC"
        };
    }

    /**
     * main
     *
     * @memberof Logger
     */
    public main = () => {
        this.mainView.innerHTML = this.defaultView;
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
        this.loadEvs();
    };

    /**
     * search field
     *
     * @memberof Logger
     */
    public searchField = (data: string) => {
        this.mainView.innerHTML = BIG_LOADER;
        this.searchInput = data.replace(/\//g, "_");
        this.changePage(1);
    };

    /**
     * change page
     *
     * @memberof Logger
     */
    public changePage = (page: number) => {
        if (this.route != undefined || this.route != null) {
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "6");
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
                    this.mainView.innerHTML = res.data;
                    this.loadEvs();
                    new Paginator({callback: this.changePage});
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                });
        }
    }

    /**
     * change type
     *
     * @memberof Logger
     */
    public changeType = (value: string[]) => {
        if (value.includes('info')) {
            this.route = ROUTES.logger.view.info;
            this.changePage(1);
        } else if (value.includes('error')) {
            this.route = ROUTES.logger.view.error;
            this.changePage(1);
        } else {
            this.mainView.innerHTML = this.defaultView;
        }
    };

    /**
     * sort action
     *
     * @memberof Logger
     */
    public sortAction = (e: Event) => {
        this.orderBy = getSort(e.currentTarget as HTMLElement);
        this.changePage(1);
    }

    /**
     * change method
     *
     * @memberof Logger
     */
    public changeMethod = (e: Event) => {
        this.method = (e.currentTarget as HTMLInputElement).value;
        this.changePage(1);
    }

    /**
     * load events
     *
     * @memberof Logger
     */
    public loadEvs = () => {
        document.getElementById("methodSelect")!.addEventListener("input", this.changeMethod);
        [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", this.sortAction));
    }
}
