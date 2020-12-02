import Axios from 'axios';
import * as Paginator from '@scripts/plugins/Paginator';
import * as Search from '@scripts/plugins/Search';
import Toast from '@scripts/plugins/AlertToast';
import {ROUTES, BIG_LOADER, BIG_LOADER_TABLE} from '@scripts/app';
import ButtonCheckGroup from '@plugins/ButtonCheckGroup';
import getSort, {SortColumn} from '@scripts/plugins/SortColumn';

export default class Logger {
    private mainView: HTMLElement;
    private searchInput: string;
    private method: string;
    private route: string;
    private orderBy: SortColumn;
    private readonly defaultView = `<tr class="table-paginator"><td colspan="6"><div class="alert alert-info w-50-c mx-auto mt-lg-5 round text-center">Debe selecionar un tipo de regsitro</div></td></tr>`;

    public constructor() {
        this.searchInput = '';
        this.method = '';
        this.route = '';
        this.mainView = ((document.getElementById("logsView") as HTMLElement) || new HTMLElement());
        this.orderBy = {
            column: "createdAt",
            order: "DESC"
        };
    }

    public main = () => {
        this.mainView.innerHTML = this.defaultView;
        Search.initialize("#searchLogInput", this.searchField);
        new ButtonCheckGroup(document.getElementById('logSwitch') as HTMLElement, {
            onChange: this.changeType,
            unCheckClass: 'btn-outline-success',
            checkClass: 'btn-success',
            extraClass: 'round'
        });
        this.loadEvs();
    };

    public searchField = (data: string) => {
        this.mainView.innerHTML = BIG_LOADER;
        this.searchInput = data.replace(/\//g, "_");
        this.changePage(1);
    };

    public changePage = (page: number) => {
        if (this.route != undefined || this.route != null) {
            this.mainView.innerHTML = BIG_LOADER_TABLE.replace("0", "6");
            const USER = (document.getElementById("registerUser") as HTMLInputElement).value;
            Axios.get(`${this.route}?search=${this.searchInput}&page=${page}&method=${this.method}&ordercol=${this.orderBy.column}&orderorder=${this.orderBy.order}&user=${USER}`)
                .then(res => {
                    this.mainView.innerHTML = res.data;
                    this.loadEvs();
                    Paginator.initialize(this.changePage);
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                });
        }
    }

    public changeType = (value: string[]) => {
        if (value.includes('info')) {
            this.route = ROUTES.logger.view.infoList;
            this.changePage(1);
        } else if (value.includes('error')) {
            this.route = ROUTES.logger.view.errorList;
            this.changePage(1);
        } else {
            this.mainView.innerHTML = this.defaultView;
        }
    };

    public sortAction = (e: Event) => {
        this.orderBy = getSort(e.currentTarget as HTMLElement);
        this.changePage(1);
    }

    public changeMethod = (e: Event) => {
        this.method = (e.currentTarget as HTMLInputElement).value;
        this.changePage(1);
    }

    public loadEvs = () => {
        document.getElementById("methodSelect")!.addEventListener("input", this.changeMethod);
        [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", this.sortAction));
    }
}
