import Axios from 'axios';
import * as Paginator from '@scripts/plugins/Paginator';
import {ROUTES, BIG_LOADER, BIG_LOADER_TABLE} from '@scripts/app';
import {openModal} from '@scripts/user/add';
import {deleteUser} from '@scripts/user/delete';
import {editUser} from '@scripts/user/edit';
import * as Search from '@scripts/plugins/Search';
import Toast from '@scripts/plugins/AlertToast';
import {openKeyModal} from '@scripts/user/key';
import {initButtonCheck, unMarkActive} from '@scripts/plugins/ButtonCheck';
import {reactiveUser} from './reactive';
import getSort, {SortColumn} from '@scripts/plugins/SortColumn';
import {hideElement, showElement} from "@plugins/Required";
import $ from "jquery";

const MAIN_VIEW = document.getElementById("usersView")!;

let SEARCH_INPUT = "";
let SUSPENDED = 0;
let ORDER_BY: SortColumn = {
    column: "id",
    order: "ASC"
};

/**
 * Cambiar de página
 *
 * @param {number} page
 */
const changePage = (page: number) => {
    MAIN_VIEW.innerHTML = BIG_LOADER_TABLE.replace("0", "9");
    Axios.get(`${ROUTES.user.view.list}?search=${SEARCH_INPUT}&page=${page}&suspended=${SUSPENDED}&ordercol=${ORDER_BY.column}&orderorder=${ORDER_BY.order}`)
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
    unMarkActive(document.getElementById("suspendedFilter") as HTMLElement);
    initButtonCheck(document.getElementById("suspendedFilter") as HTMLElement, suspendedFilter);
    MAIN_VIEW.innerHTML = BIG_LOADER;
    Search.initialize("#searchUserInput", searchField);
    changePage(1);
};

/**
 * Buscar usuario
 *
 * @param {string} data
 */
const searchField = (data: string) => {
    MAIN_VIEW.innerHTML = BIG_LOADER;
    SEARCH_INPUT = data;
    changePage(1);
};

/**
 * Filtrar por usuarios suspendidos
 *
 * @param {boolean} status
 */
const suspendedFilter = (status: boolean) => {
    SUSPENDED = +status;
    changePage(1);
};

/**
 * Agregar a un usuario nuevo
 *
 */
const addUserAction = () => {
    openModal(mainView);
};

/**
 * Eliminar un usuario
 *
 * @param {Event} e
 */
const deleteAction = (e: Event) => {
    const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
    // noinspection JSIgnoredPromiseFromCall
    deleteUser(ELEMENT, () => {
    }, loadEvs);
};

/**
 * Reactivar un usuario
 *
 * @param {Event} e
 */
const reactivateAction = (e: Event) => {
    const ELEMENT = (e.currentTarget as HTMLElement).closest(".user-row") as HTMLElement;
    // noinspection JSIgnoredPromiseFromCall
    reactiveUser(ELEMENT, () => {
    }, loadEvs);
    // reactiveUser(+ELEMENT.getAttribute("id")!, () => {
    //     deleteElement(ELEMENT as HTMLElement);
    // });
};

/**
 * Cambiar de contraseña
 *
 * @param {Event} e
 */
const changePassAction = (e: Event) => {
    openKeyModal(+(e.currentTarget as HTMLElement).closest(".user-row")!.getAttribute("id")!);
};

/**
 * Editar usuario
 *
 * @param {Event} e
 */
const editAction = (e: Event) => {
    editUser(+(e.currentTarget as HTMLElement).closest(".user-row")!.getAttribute("id")!, mainView);
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
 * Cargar eventos
 *
 * @param {boolean} [first=false]
 */
const loadEvs = (first: boolean = false) => {
    document.getElementById("user-add")!.addEventListener("click", addUserAction);
    if (!first) {
        [...document.getElementsByClassName("user-delete")].forEach(
            element => element.addEventListener("click", deleteAction)
        );
        [...document.getElementsByClassName("user-password")].forEach(
            element => element.addEventListener("click", changePassAction)
        );
        [...document.getElementsByClassName("user-edit")].forEach(
            element => element.addEventListener("click", editAction)
        );
        [...document.getElementsByClassName("user-reactivate")].forEach(
            element => element.addEventListener("click", reactivateAction)
        );
        [...document.getElementsByClassName("sort-column")].forEach(element => element.addEventListener("click", sortAction));
    }
};

loadEvs(true);
mainView();
