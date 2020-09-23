import Axios from 'axios';
import * as Paginator from '@scripts/plugins/Paginator';
import * as Search from '@scripts/plugins/Search';
import Toast from '@scripts/plugins/AlertToast';
import { ROUTES, BIG_LOADER, BIG_LOADER_TABLE } from '@scripts/app';
import { initButtonCheck, unMarkActive } from '@scripts/plugins/ButtonCheck';
import getSort, { SortColumn } from '@scripts/plugins/SortColumn';

const MAIN_VIEW = document.getElementById("logsView") as HTMLElement;
let SEARCH_INPUT = "";
let METHOD = "";
let ROUTE: string;
let ORDER_BY: SortColumn = {
    column: "createdAt",
    order: "DESC"
};

const INFO_ID = "infoLogSwitch";
const ERROR_ID = "errorLogSwitch";
const defaultView = `
<td colspan="6" class="table-paginator">
    <div class="alert alert-info w-50-c mx-auto mt-lg-5">
        Debe selecionar un tipo de regsitro
    </div>
</td>
`;
/**
 * Cambiar de página
 *
 * @param {number} page
 */
const changePage = (page: number) => {
    if (ROUTE != undefined || ROUTE != null) {
        MAIN_VIEW.innerHTML = BIG_LOADER_TABLE.replace("0", "6");
        Axios.get(`${ROUTE}?search=${SEARCH_INPUT}&page=${page}&method=${METHOD}&ordercol=${ORDER_BY.column}&orderorder=${ORDER_BY.order}`)
            .then(res => {
                MAIN_VIEW.innerHTML = res.data;
                loadEvs();
                Paginator.initialize(changePage);
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    }
};

/**
 * Vista principal
 *
 */
const mainView = () => {
    MAIN_VIEW.innerHTML = defaultView;
    Search.initialize("#searchLogInput", searchField);
    initButtonCheck(document.getElementById(INFO_ID) as HTMLElement, changeType);
    initButtonCheck(document.getElementById(ERROR_ID) as HTMLElement, changeType);
    loadEvs();
};

/**
 *Buscar usuario
 *
 * @param {string} data
 */
const searchField = (data: string) => {
    MAIN_VIEW.innerHTML = BIG_LOADER;
    SEARCH_INPUT = data.replace(/\//g, "_");
    changePage(1);
};

/**
 * Cambiar tipo de registros
 *
 * @param {boolean} state
 * @param {string} id
 */
const changeType = (state: boolean, id?: string) => {
    if (state) {
        if (id == INFO_ID) {
            ROUTE = ROUTES.logger.view.infoList;
            unMarkActive(document.getElementById(ERROR_ID) as HTMLElement);
        } else if (id == ERROR_ID) {
            ROUTE = ROUTES.logger.view.errorList;
            unMarkActive(document.getElementById(INFO_ID) as HTMLElement);
        }
        changePage(1);
    } else {
        unMarkActive(document.getElementById(id!) as HTMLElement);
        MAIN_VIEW.innerHTML = defaultView;
    }
};

const changeMethod = (e: Event) => {
    METHOD = (e.currentTarget as HTMLInputElement).value;
    changePage(1);
};

/**
 * Ordenar elementos por columna
 *
 * @param {Event} e
 */
const sortAction = (e: Event) => {
    ORDER_BY = getSort(e.currentTarget as HTMLElement);
    changePage(1);
};

/**
 * Cargare eventos
 *
 */
const loadEvs = () => {
    document.getElementById("methodSelect")!.addEventListener("input", changeMethod);
    [ ...document.getElementsByClassName("sort-column") ].forEach(element => element.addEventListener("click", sortAction));
};

mainView();