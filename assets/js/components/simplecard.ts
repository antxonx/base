/**
* @packageDocumentation
* @module Components
*/
import htmlToElement from "@components/HtmlToElement";

/* -------------------------------------------------------------------------- */
/*                              Estrucutras base                              */
/* -------------------------------------------------------------------------- */

/* ------------------------ contenedor de la tarjeta ------------------------ */

const _BASE = `<div class="card card-body board main-2"></div>`;

/* ------------------------------------ . ----------------------------------- */

/* ------------------------ contenedor para el cuerpo ----------------------- */

const _CONTENT = `<div>#content#</div>`;

/* ------------------------------------ . ----------------------------------- */

/* ------------------------ Contenedor para el título ----------------------- */

const _TITLE = `<div class="text-center">#title#<hr class="divide-2"></div>`;

/* ------------------------------------ . ----------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                      .                                     */
/* -------------------------------------------------------------------------- */

(function () {
    [...document.getElementsByTagName("simple-card")].forEach(el => {

        /* -------------------- Tomamos los parámetros definidos -------------------- */

        const CONTENT = el.getElementsByTagName("simple-card-content")[0]?.innerHTML;
        const TITLE = el.getElementsByTagName("simple-card-title")[0]?.innerHTML;
        const CLASS = el.getAttribute("class");

        /* ------------------------------------ . ----------------------------------- */

        /* --------------------- Creamos la base del componente --------------------- */

        let template = htmlToElement(_BASE);

        /* ------------------------------------ . ----------------------------------- */

        /* ---------------------- Si tiene título se lo ponemos --------------------- */

        if (TITLE && TITLE != "") {
            template.appendChild(htmlToElement(_TITLE.replace("#title#", TITLE)));
        }

        /* ------------------------------------ . ----------------------------------- */

        /* -------------------- Si tiene clases se las agregamos -------------------- */

        if (CLASS && CLASS != "") {
            template.classList.add(CLASS);
        }

        /* ------------------------------------ . ----------------------------------- */

        /* ------------------------- Agregamos el contenido ------------------------- */

        template.appendChild(htmlToElement(_CONTENT.replace("#content#", CONTENT)));

        /* ------------------------------------ . ----------------------------------- */

        /* ----------------- remplazamos la etiqueta por el elemento ---------------- */

        el.parentElement!.replaceChild(template, el);

        /* ------------------------------------ . ----------------------------------- */

    });
})();
