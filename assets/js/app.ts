import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/js/all.min.js';
import 'bootstrap';
import 'x-editable/dist/bootstrap3-editable/css/bootstrap-editable.css';
import 'x-editable/dist/bootstrap3-editable/js/bootstrap-editable';
import '@styles/app.sass';

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

export const ROUTES = {
    user: {
        view: {
            index: (document.getElementById("user-index-route") as HTMLInputElement).value,
            list: (document.getElementById("user-list-route") as HTMLInputElement).value,
            form: (document.getElementById("user-form-route") as HTMLInputElement).value,
            key: (document.getElementById("user-key-route") as HTMLInputElement).value,
            edit: (document.getElementById("user-edit-api") as HTMLInputElement).value,
            passform: (document.getElementById("user-profile-pass-form-route") as HTMLInputElement).value,
        },
        api: {
            add: (document.getElementById("user-add-api") as HTMLInputElement).value,
            update: (document.getElementById("user-update-api") as HTMLInputElement).value,
            keyUpdate: (document.getElementById("user-key-update-api") as HTMLInputElement).value,
            delete: (document.getElementById("user-delete-api") as HTMLInputElement).value,
            reactivate: (document.getElementById("user-reactivate-api") as HTMLInputElement).value,
            passchange: (document.getElementById("user-profile-pass-api") as HTMLInputElement).value,
        }
    },
    client: {
        view: {
            index: (document.getElementById("client-index-route") as HTMLInputElement).value,
            list: (document.getElementById("client-list-route") as HTMLInputElement).value,
            form: (document.getElementById("client-form-route") as HTMLInputElement).value,
            addresForm: (document.getElementById("client-address-form-route") as HTMLInputElement).value,
            contactForm: (document.getElementById("client-contact-form-route") as HTMLInputElement).value,
            show: (document.getElementById("client-show-route") as HTMLInputElement).value,
            contactShow: (document.getElementById("client-contact-show-route") as HTMLInputElement).value,
        },
        api: {
            add: (document.getElementById("client-add-api") as HTMLInputElement).value,
            addExtra: (document.getElementById("client-extra-add-api") as HTMLInputElement).value,
            addContactExtra: (document.getElementById("client-contact-extra-add-api") as HTMLInputElement).value,
            addressAdd: (document.getElementById("client-address-add-api") as HTMLInputElement).value,
            contactAdd: (document.getElementById("client-contact-add-api") as HTMLInputElement).value,
            delete: (document.getElementById("client-delete-api") as HTMLInputElement).value,
            extraDelete: (document.getElementById("client-extra-delete-api") as HTMLInputElement).value,
            extraContactDelete: (document.getElementById("client-contact-extra-delete-api") as HTMLInputElement).value,
            contactDelete: (document.getElementById("client-contact-delete-api") as HTMLInputElement).value,
            contactUpdate: (document.getElementById("client-contact-update-api") as HTMLInputElement).value,
        }
    },
    clientCategory : {
      view: {
          index: (document.getElementById("client-category-index-route") as HTMLInputElement).value,
          list: (document.getElementById("client-category-list-route") as HTMLInputElement).value,
          form: (document.getElementById("client-category-form-route") as HTMLInputElement).value,
          changeForm: (document.getElementById("client-category-change-form-route") as HTMLInputElement).value,
      },
      api: {
          add: (document.getElementById("client-category-api-add-route") as HTMLInputElement).value,
          delete: (document.getElementById("client-category-api-delete-route") as HTMLInputElement).value,
      }
    },
    logger: {
        view: {
            index: (document.getElementById("logger-index-route") as HTMLInputElement).value,
            infoList: (document.getElementById("logger-info-list-route") as HTMLInputElement).value,
            errorList: (document.getElementById("logger-error-list-route") as HTMLInputElement).value,
        }
    }
};

export const BIG_LOADER = '<div class="loader"></div>';
export const BIG_LOADER_TABLE = '<tr class="table-paginator"><td colspan="0"><div class="loader"></div></td></tr>';
export const SPINNER_LOADER = '<div class="w-100 d-flex justify-content-center"><div class="spinner"></div></div>';
