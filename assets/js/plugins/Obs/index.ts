/**
 * manages the obs module
 * @packageDocumentation
 * @module Obs
 * @preferred
 */
import { BIG_LOADER, Router, ROUTES } from "@scripts/app";
import HtmlToElement from "@scripts/components/HtmlToElement";
import Axios from "axios";
import Toast from "../AlertToast";
import { ObsI, ObsOptions } from "./defs";

export default class Obs {

    protected options: ObsOptions

    protected readonly individualTemplate :string;
    protected readonly textBox :string;

    public constructor(options: ObsOptions) {
        this.options = options;
        this.individualTemplate  = `
        <div class="d-flex justify-content-between">
        #fill-left#
        <div class="card py-1 px-3 m-1 pb-2 round #customClass#">
            <div class="text-left">
                <span><em><b>#createdBy#</b></em></span>
            </div>
            #description#
            <span class="obs-time">#time#</span>
        </div>#fill-right#</div>`;
        this.textBox = `
            <div class="add-obs-cont">
                <div class="obs-text text-center">
                    <textarea class="form-control" rows="2"></textarea>
                </div>
                <div class="obs-submit">
                    <button class="btn btn-success round"><span class="hide-on-desktop">Agregar</span><span class="material-icons-round hide-on-mobile">send</span></button>
                </div>
            </div>
        `;
    }

    public load = () => {
        this.options.element.innerHTML = BIG_LOADER;
        Axios.get(Router.generate(ROUTES.obs.api.get, {
            "entity" : this.options.entity,
            "id" : this.options.id
        }))
        .then(res => {
            const reqObs = res.data as ObsI[];
            let obsCont = document.createElement("div");
            obsCont.classList.add("obs-scroll");
            let allObs = "";
            let tempDate = "";
            reqObs.forEach(ob => {
                if(ob.createdAt.date != tempDate) {
                    allObs += `<div class="text-center text-muted"><small><em>${ob.createdAt.date}</em></small><hr class="mt-0 mb-0 ml-5 mr-5"></div>`;
                    tempDate = ob.createdAt.date;
                }
                let obTemp = this.individualTemplate.replace("#createdBy#", ob.createdBy).replace("#description#", ob.description).replace("#time#", ob.createdAt.time).replace("#customClass#", ob.customClass);
                if(ob.customClass == "obs-left") {
                    obTemp = obTemp.replace("#fill-right#", '<div class="fill-space"></div>').replace("#fill-left#", "");
                } else {
                    obTemp = obTemp.replace("#fill-left#", '<div class="fill-space"></div>').replace("#fill-right#", "");
                }
                allObs += obTemp;
            });
            this.options.element.innerHTML = "";
            obsCont.appendChild(HtmlToElement("<div>" + allObs + "</div>"));
            this.options.element.appendChild(obsCont);
            this.options.element.appendChild(HtmlToElement(this.textBox));
            obsCont.scrollTop = obsCont.scrollHeight;
            $('#task-obs-view-tab').on('shown.bs.tab', () => {
                obsCont.scrollTop = obsCont.scrollHeight;
            });
        })
        .catch(err => {
            console.error(err);
            console.error(err.response.data);
            Toast.error(err.response.data);
        })
    }
}