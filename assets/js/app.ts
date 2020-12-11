import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import 'bootstrap';
import 'x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css';
import 'x-editable/dist/bootstrap3-editable/js/bootstrap-editable';
import '@styles/app.sass';
const routes = require('@scripts/fos_js_routes.json');
import {Router as Routing} from 'symfony-ts-router';
import {Routes} from "@scripts/routes";
/* ------------------ Configuración para bootstrap-editable ----------------- */

//@ts-ignore
$.fn.editable.defaults.ajaxOptions = {type: "PATCH"};
// @ts-ignore
$.fn.editable.defaults.mode = 'inline';
// @ts-ignore
$.fn.editable.defaults.emptytext = 'Vacío';
// @ts-ignore
$.fn.editable.defaults.onblur = 'ignore';
// @ts-ignore
$.fn.editable.defaults.send = 'always';

/* ------------------------------------ . ----------------------------------- */

const BASE_ELEMENT = (document.getElementById('baseURL') as HTMLInputElement);
const BASE_URL = BASE_ELEMENT.value;
const router = new Routing();
BASE_ELEMENT.parentElement!.removeChild(BASE_ELEMENT);
router.setRoutingData(routes);
router.setBaseUrl(BASE_URL);
export const Router = router;

export const ROUTES = Routes;

export const BIG_LOADER = '<div class="loader"></div>';
export const BIG_LOADER_TABLE = '<tr class="table-paginator"><td colspan="0"><div class="loader"></div></td></tr>';
export const SPINNER_LOADER = '<div class="w-100 d-flex justify-content-center"><div class="spinner"></div></div>';
