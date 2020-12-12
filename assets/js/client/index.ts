import Axios from 'axios';
import Paginator from '@scripts/plugins/Paginator';
import {BIG_LOADER_TABLE, Router, ROUTES} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import Search from '@scripts/plugins/Search';
import {showClient} from './show';
import getSort, {SortColumn} from '@scripts/plugins/SortColumn';
import Add from "@scripts/client/add";
import Delete from "@scripts/client/delete";

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
    Axios.get(Router.generate(ROUTES.client.view.list, {
        'search': SEARCH_INPUT,
        'page': page,
        'ordercol': ORDER_BY.column,
        'orderorder': ORDER_BY.order
    }))
        .then(res => {
            MAIN_VIEW.innerHTML = res.data;
            loadEvs();
            new Paginator({callback: changePage});
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
    new Search({
        callback: searchField,
        selector: "#searchClientInput"
    });
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
    (new Delete({
        element: ELEMENT,
        onError: loadEvs
    })).delete();
};

/**
 * Agregar elemento
 *
 */
const addAction = () => {
    (new Add(mainView)).load();
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
    [...document.getElementsByClassName("client-delete")].forEach(element => element.addEventListener("click", deleteAction));
    [...document.getElementsByClassName("client-show")].forEach(element => element.addEventListener("click", showAction));
    [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", sortAction));
};

loadEvs(true);
mainView();
