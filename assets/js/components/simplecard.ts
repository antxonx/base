import { htmlToElement } from "@scripts/plugins/Required";

const _BASE = `<div class="card card-body board"></div>`;

const _CONTENT = `<div>#content#</div>`;

const _TITLE = `<div>#title#<hr></div>`;

(function () {
    [ ...document.getElementsByTagName("simple-card") ].forEach(el => {
        const CONTENT = el.getElementsByTagName("simple-card-content")[0]?.innerHTML;
        const TITLE = el.getElementsByTagName("simple-card-title")[0]?.innerHTML;
        const CLASS = el.getAttribute("class");
        let template = htmlToElement(_BASE);

        if(TITLE && TITLE != ""){
            template.appendChild(htmlToElement(_TITLE.replace("#title#", TITLE)));
        }
        if(CLASS && CLASS != ""){
            template.classList.add(CLASS);
        }
        template.appendChild(htmlToElement(_CONTENT.replace("#content#", CONTENT)));
        el.parentElement!.replaceChild(template, el);
    });
})();