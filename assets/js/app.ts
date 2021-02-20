/**
 * Entry index and global definitions
 * @packageDocumentation
 * @module App
 * @preferred
 */
import '@styles/app.scss';
import { Router as Routing } from 'symfony-ts-router';
import { Routes } from "@scripts/routes";
import 'bootstrap';

const routes = require('@scripts/fos_js_routes.json');
/* ---------------------------------- Router -------------------------------- */
const BASE_ELEMENT: HTMLInputElement = (document.getElementById('baseURL') as HTMLInputElement);
const BASE_URL: string = BASE_ELEMENT.value;
const router: Routing = new Routing();
BASE_ELEMENT.parentElement!.removeChild(BASE_ELEMENT);
router.setRoutingData(routes);
router.setBaseUrl(BASE_URL);
export const Router: Routing = router;
export const ROUTES = Routes;
/* ------------------------------------ . ----------------------------------- */
export const BIG_LOADER: string = '<div class="loader"></div>';
export const BIG_LOADER_TABLE: string = '<tr class="table-paginator"><td colspan="0"><div class="loader"></div></td></tr>';
export const SPINNER_LOADER: string = '<div class="w-100 d-flex justify-content-center"><div class="spinner"></div></div>';
export enum ConfigTypes {
    TaskCommentedBorder,
    TaskDoneColors,
    TaskRecurrentBorder,
}