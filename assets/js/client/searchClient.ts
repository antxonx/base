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

    public getClientId = () : number => {
        return this.clientId;
    }

    private searchClients = (data: string) => {
        this.list.innerHTML = `<li class="list-group-item text-center">${SPINNER_LOADER}</li>`;
        if(data.trim() != "") {
            this.element.classList.add("open");
            this.element.parentElement!.getElementsByClassName("input-group-text")[0].classList.add("open");
            this.list.style.display = "block";
            Axios.get(Router.generate(ROUTES.client.api.search, {
                'client': data
            }))
            .then(res => {
                const clients = res.data as ClientSearchInfo[];
                this.list.innerHTML = "";
                if(clients.length > 0) {
                    clients.forEach(client => {
                        this.list.innerHTML += `<li class="list-group-item hover cursor-pointer client-select-list" client-id="${client.id}">${client.name}</li>` 
                    });
                    Array.from(document.getElementsByClassName("client-select-list")).forEach(el => el.addEventListener("click", this.select));
                } else {
                    this.list.innerHTML = '<li class="list-group-item p-0"><div class="alert alert-info m-0"><em>No se encontró al cliente</em></div></li>'
                }
            })
            .catch(err => {
                console.error(err);
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
        } else {
            this.clientId = 0;
            this.list.style.display = "none";
            this.element.classList.remove("open");
            this.element.parentElement!.getElementsByClassName("input-group-text")[0].classList.remove("open");
        }
    }

    private select = (e: Event) => {
        const ELEMENT = e.currentTarget as HTMLElement;
        this.clientId = +ELEMENT.getAttribute("client-id")!;
        this.element.value = ELEMENT.innerText;

        this.list.style.display = "none";
            this.element.classList.remove("open");
            this.element.parentElement!.getElementsByClassName("input-group-text")[0].classList.remove("open");
    }
}