/**
* @packageDocumentation
* @module Calendar
*/

import { BIG_LOADER, Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";

export default class Calendar {

    protected control: boolean;

    protected mainView: HTMLElement;

    protected offset: number;

    protected opened: number;

    public constructor() {
        this.control = true;
        this.offset = 0;
        this.opened = 0;
        this.mainView = document.getElementById("CalendarView") || document.createElement("div");
    }

    public load = () => {
        if(this.control) {
            this.control = false;
            document.getElementById("calendarBefore")?.addEventListener('click', () => {this.addOffset(-1)});
            document.getElementById("calendarToday")?.addEventListener('click', () => {this.addOffset(0, true)});
            document.getElementById("calendarAfter")?.addEventListener('click', () => {this.addOffset(1)});
            this.update();
        }
        [...document.getElementsByClassName("schedule-day")].forEach(el => el.addEventListener("click", this.openDay));
    }

    private update = () => {
        this.mainView.innerHTML = BIG_LOADER;
        Axios.get(Router.generate(ROUTES.calendar.view.month, {
            'offset': this.offset
        }))
        .then(res => {
            this.mainView.innerHTML = res.data;
            this.load();
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        })
    }

    private addOffset = (value: number, set: boolean = false) => {
        if(set) {
            this.offset = value;
        } else {
            this.offset += value;
        }
        this.update();
    }

    private openDay = (e: Event) => {
        const ELEMENT = e.currentTarget as HTMLElement;
        const DAY = +ELEMENT.getAttribute("day")!;
        const WEEK = ELEMENT.getAttribute("week");
        if(DAY) {
            console.log(this.opened);
            const INFO_CONT = document.querySelector(`.schedule-info[week="${WEEK}"]`) as HTMLElement;
            if(this.opened != 0) {
                if(DAY == this.opened) {
                    INFO_CONT.classList.remove("show");
                    this.opened = 0;
                } else {
                    [...document.getElementsByClassName("schedule-info")].forEach(el => {
                        el.classList.remove("show");
                    });
                    INFO_CONT.classList.add("show");
                    this.opened = DAY;
                }
            } else {
                INFO_CONT.classList.add("show");
                this.opened = DAY;
            }

        }
    }
}
