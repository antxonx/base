/**
 * manages the obs module
 * @packageDocumentation
 * @module Obs
 * @preferred
 */
import { BIG_LOADER, Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import HtmlToElement from "@scripts/components/HtmlToElement";
import Axios from "axios";
import Toast from "../AlertToast";
import { ObsI, ObsOptions } from "./defs";

import '@styles/obs.scss';

export default class Obs {

    protected options: ObsOptions

    protected readonly individualTemplate :string;
    protected readonly textBox :string;

    public constructor(options: ObsOptions) {
        this.options = options;
        this.individualTemplate  = `
        <div class="d-flex justify-content-between">
        #fill-left#
        <div class="card py-1 px-3 m-1 pb-2 round text-justify #customClass#">
            <div class="text-left">
                <span><em><b>#createdBy#</b></em></span>
            </div>
            #description#
            <span class="obs-time">#time#</span>
        </div>#fill-right#</div>`;
        this.textBox = `
            <div class="add-obs-cont">
                <div class="obs-text text-center">
                    <textarea class="form-control" id="add-obs-text" rows="1"></textarea>
                </div>
                <div class="obs-submit">
                    <button class="btn btn-success round" id="add-obs-btn">
                    <span class="material-icons-round">send</span></button>
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
                let obTemp = this.individualTemplate.replace("#createdBy#", ob.createdBy).replace("#description#", ob.description.trim()).replace("#time#", ob.createdAt.time).replace("#customClass#", ob.customClass);
                console.log(ob.description);
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
            this.evs();
        })
        .catch(err => {
            console.error(err);
            console.error(err.response.data);
            Toast.error(err.response.data);
        })
    }

    private evs = () => {
        const OBS_TA = document.getElementById("add-obs-text") as HTMLTextAreaElement;
        OBS_TA.addEventListener("keyup", () => {
            if(OBS_TA.value.trim() == "") {
                OBS_TA.rows = 1;
            }
            if((OBS_TA.clientHeight < OBS_TA.scrollHeight) && (OBS_TA.rows < 4)) {
                OBS_TA.rows++;
            }
        });
        document.getElementById("add-obs-btn")!.addEventListener("click", this.addObs);
    }

    private addObs = () => {
        const OBS = (document.getElementById("add-obs-text") as HTMLTextAreaElement);
        const CONT = document.getElementsByClassName("add-obs-cont")![0];
        const BEF = CONT.innerHTML;
        CONT.innerHTML = SPINNER_LOADER;
        if(OBS.value.trim() != ""){
            Axios.post(Router.generate(ROUTES.obs.api.add), {
                entity: this.options.entity,
                id: this.options.id,
                description: OBS.value,
            })
            .then(res => {
                if(this.options.callback)
                    this.options.callback!();
                Toast.success(res.data);
                this.load();
            })
            .catch(err => {
                CONT.innerHTML = BEF;
                this.evs();
                console.error(err);
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
        }
    }
}