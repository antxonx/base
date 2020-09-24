import Axios from 'axios';
import * as Paginator from '@scripts/plugins/Paginator';
import { ROUTES, BIG_LOADER_TABLE } from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import * as Search from '@scripts/plugins/Search';
import { openAddModal } from './add';
import { deleteClient } from './delete';
import { deleteElement } from '@scripts/plugins/DeleteElement';
import { showClient } from './show';
import getSort, { SortColumn } from '@scripts/plugins/SortColumn';

const MAIN_VIEW = document.getElementById("clientsView") as HTMLElement;

let SEARCH_INPUT = "";
let ORDER_BY: SortColumn = {
    column: "name",
    order: "ASC"
};

/**
 * Cambiar de página
 *
 * @param {number} page
 */
const changePage = (page: number) => {
    MAIN_VIEW.innerHTML = BIG_LOADER_TABLE.replace("0", "5");
    Axios.get(`${ROUTES.client.view.list}?search=${SEARCH_INPUT}&page=${page}&ordercol=${ORDER_BY.column}&orderorder=${ORDER_BY.order}`)
        .then(res => {
            MAIN_VIEW.innerHTML = res.data;
            loadEvs();
            Paginator.initialize(changePage);
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
};

/**
 * Vista principal
 *
 */
const mainView = () => {
    Search.initialize("#searchClientInput", searchField);
    changePage(1);
};

/**
 * Buscar Cleinte
 *
 * @param {string} data
 */
const searchField = (data: string) => {
    SEARCH_INPUT = data;
    changePage(1);
};

/**
 * Eliminar cliente
 *
 * @param {Event} e
 */
const deleteAction = (e: Event) => {
    const ELEMENT = (e.currentTarget as HTMLElement).closest(".client-row") as HTMLElement;
    deleteClient(ELEMENT, () => {}, loadEvs);
};

/**
 * Agregar elemento
 *
 */
const addAction = () => {
    openAddModal(mainView);
};

/**
 * Ver cliente
 *
 * @param {Event} e
 */
const showAction = (e: Event) => {
    const ELEMENT = (e.currentTarget as HTMLElement).closest(".client-row")!;
    showClient(+ELEMENT.getAttribute("id")!, mainView);
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

const loadEvs = (first = false) => {
    if (first) {
        document.getElementById("client-add")?.addEventListener("click", addAction);
    }
    [ ...document.getElementsByClassName("client-delete") ].forEach(element => element.addEventListener("click", deleteAction));
    [ ...document.getElementsByClassName("client-show") ].forEach(element => element.addEventListener("click", showAction));
    [ ...document.getElementsByClassName("sort-column") ].forEach(element => element.addEventListener("click", sortAction));
};

loadEvs(true);
mainView();