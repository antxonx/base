/**
* @packageDocumentation
* @module Client
*/
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import HtmlToElement from "@scripts/components/HtmlToElement";
import Toast from "@scripts/plugins/AlertToast";
import Search from "@scripts/plugins/Search";
import Axios from "axios";
import { ClientSearchInfo } from "./defs";


/**
 * Manages input on search field
 *
 * @export
 * @class SearchClient
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class SearchClient {

    protected clientId: number;

    protected element: HTMLInputElement;

    protected list: HTMLElement;

    public constructor (selector: string) {
        this.clientId = 0;
        this.element = document.querySelector(selector) as HTMLInputElement;
        new Search({
            element: this.element,
            callback: this.searchClients
        });
        this.list = HtmlToElement('<ul class="list-group mt-3" style="position: absolute;z-index: 10;width: 100%;transform: translateY(-16px); max-height: 200px; overflow-y: auto;"></ul>');
        this.element.closest(".search-input")!.appendChild(this.list);
        this.list.style.display = "none";
    }

    public getClientId = (): number => {
        return this.clientId;
    };

    private searchClients = async (data: string) => {
        this.list.innerHTML = `<li class="list-group-item text-center">${SPINNER_LOADER}</li>`;
        if (data.trim() != "") {
            this.element.classList.add("open");
            this.element.parentElement!.getElementsByClassName("input-group-text")[ 0 ].classList.add("open");
            this.list.style.display = "block";
            try {
                const res = await Axios.get(
                    Router.generate(ROUTES.client.api.search, {
                        'client': data
                    })
                );
                const clients = res.data as ClientSearchInfo[];
                this.list.innerHTML = "";
                let temp = "";
                if (clients.length > 0) {
                    clients.forEach(client => {
                        temp += `<li class="list-group-item hover cursor-pointer client-select-list" client-id="${client.id}">
                        <div class="row">
                            <div class="col-md-2">
                                <div class="badge round color-shadow w-100"`;
                        if (client.category) {
                            temp += ` style="background-color: ${client.category.color}; color: ${client.category.color};" data-toggle="tooltip" data-placement="top" data-html="true" title="<em>${client.category.name}</em>"`;
                        } else {
                            temp += ` style="background-color: #ffffff; color: #ffffff;" data-toggle="tooltip" data-placement="top" data-html="true" title="<em>Sin categoría</em>"`;
                        }
                        temp += `>
                                <i class="fas fa-palette"></i>
                                </div>
                            </div>
                            <div class="col-md-10">${client.name}</div>
                        </div>
                    </li>`;
                        this.list.innerHTML = temp;
                        $('[data-toggle="tooltip"]').tooltip();
                    });
                    Array.from(document.getElementsByClassName("client-select-list")).forEach(el => el.addEventListener("click", this.select));
                } else {
                    this.list.innerHTML = '<li class="list-group-item p-0"><div class="alert alert-info m-0"><em>No se encontró al cliente</em></div></li>';
                }
            } catch (err) {
                const e = err.response ? err.response.data : err;
                console.error(e);
                Toast.error(e);
            }
        } else {
            this.clientId = 0;
            this.list.style.display = "none";
            this.element.classList.remove("open");
            this.element.parentElement!.getElementsByClassName("input-group-text")[ 0 ].classList.remove("open");
        }
    };

    private select = (e: Event) => {
        const ELEMENT = e.currentTarget as HTMLElement;
        this.clientId = +ELEMENT.getAttribute("client-id")!;
        this.element.value = ELEMENT.innerText;

        this.list.style.display = "none";
        this.element.classList.remove("open");
        this.element.parentElement!.getElementsByClassName("input-group-text")[ 0 ].classList.remove("open");
    };
}