/**
* @packageDocumentation
* @module Schedule
*/

import { BIG_LOADER, Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";
import ButtonCheckGroup from '@plugins/ButtonCheckGroup';
import { ScheduleType } from './defs';

export default class Schedule {

    protected control: boolean;

    protected mainView: HTMLElement;

    protected offset: number;

    protected opened: number;

    protected route: string;

    //protected bbb: ButtonCheckGroup|null;

    public constructor() {
        this.control = true;
        this.offset = 0;
        this.opened = 0;
        this.mainView = document.getElementById("CalendarView") || document.createElement("div");
        this.route = '';//ROUTES.schedule.view.week;
        //this.bbb = null;
    }

    public load = () => {
        if(this.control) {
            this.control = false;
            document.getElementById("calendarBefore")?.addEventListener('click', () => {this.addOffset(-1)});
            document.getElementById("calendarToday")?.addEventListener('click', () => {this.addOffset(0, true)});
            document.getElementById("calendarAfter")?.addEventListener('click', () => {this.addOffset(1)});
            const check = new ButtonCheckGroup(document.getElementById('scheduleTypeSwitch') as HTMLElement, {
                onChange: this.changeType,
                unCheckClass: 'btn-outline-success',
                checkClass: 'btn-success',
                extraClass: 'round',
                activeValue: 'week',
            });
            this.route = ROUTES.schedule.view[(check.getValues()[0] as ScheduleType)];
            this.update();
        }
        [...document.getElementsByClassName("schedule-day")].forEach(el => el.addEventListener("click", this.openDay));
    }

    private update = () => {
        this.mainView.innerHTML = BIG_LOADER;
        Axios.get(Router.generate(this.route, {
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
        if(DAY) {
            const INFO_CONT = document.querySelector(`.schedule-info[day="${DAY}"]`) as HTMLElement;
            if(this.opened != 0) {
                if(DAY == this.opened) {
                    INFO_CONT.classList.remove("show");
                    this.opened = 0;
                } else {
                    [...document.getElementsByClassName("schedule-info")].forEach(el => el.classList.remove("show"));
                    INFO_CONT.classList.add("show");
                    this.opened = DAY;
                }
            } else {
                INFO_CONT.classList.add("show");
                this.opened = DAY;
            }
        }
    }

    private changeType = (value: string[]) => {
        this.route = ROUTES.schedule.view[(value[0] as ScheduleType)];
        this.update();
    }
}
