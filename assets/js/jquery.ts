import 'bootstrap/js/dist/popover';
import 'x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css';
import 'x-editable/dist/bootstrap3-editable/js/bootstrap-editable';
import '@styles/editable.scss';
/* ------------------ Configuración para bootstrap-editable ----------------- */
//@ts-ignore
$.fn.editable.defaults.ajaxOptions = { type: "PATCH" };
// @ts-ignore
$.fn.editable.defaults.mode = 'inline';
// @ts-ignore
$.fn.editable.defaults.emptytext = 'Vacío';
// @ts-ignore
$.fn.editable.defaults.onblur = 'ignore';
// @ts-ignore
$.fn.editable.defaults.send = 'always';
/* ------------------------------------ . ----------------------------------- */