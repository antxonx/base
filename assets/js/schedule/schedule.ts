/**
* @packageDocumentation
* @module Schedule
*/

import { BIG_LOADER, Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";
import ButtonCheckGroup from '@plugins/ButtonCheckGroup';
import { ScheduleType } from './defs';
import { isMobile } from "@scripts/plugins/Required";
import Search from "@scripts/plugins/Search";
import DropdownSelect from "@scripts/plugins/DropdownSelect";
import '@styles/schedule.scss';

export default class Schedule {

    protected control: boolean;

    protected mainView: HTMLElement;

    protected offset: number;

    protected opened: number;

    protected searchInput: string;

    protected me: number;

    protected finished: number;

    protected route: string;

    protected category: number;

    protected showRecurrents: number;

    public constructor () {
        this.control = true;
        this.offset = 0;
        this.opened = 0;
        this.category = 0;
        this.searchInput = '';
        this.me = 1;
        this.finished = 0;
        this.showRecurrents = 1;
        this.mainView = document.getElementById("CalendarView") || document.createElement("div");
        this.route = '';
    }

    public load = () => {
        if (this.control) {
            this.control = false;
            let active: string;
            document.getElementById("calendarBefore")?.addEventListener('click', () => { this.addOffset(-1); });
            document.getElementById("calendarToday")?.addEventListener('click', () => { this.addOffset(0, true); });
            document.getElementById("calendarAfter")?.addEventListener('click', () => { this.addOffset(1); });
            document.getElementById("schedule-add")?.addEventListener('click', async () => {
                const { default: Add } = await import('@scripts/schedule/add');
                (new Add(this.update)).load();
            });
            if (isMobile()) {
                active = 'day';
            } else {
                active = 'week';
            }
            const check = new ButtonCheckGroup(document.getElementById('scheduleTypeSwitch') as HTMLElement, {
                onChange: this.changeType,
                unCheckClass: 'btn-outline-info',
                checkClass: 'btn-info',
                extraClass: 'round',
                activeValue: [ active ],
                oneActive: true
            });
            if (document.getElementById('superCheck')) {
                (new ButtonCheckGroup(document.getElementById('superCheck') as HTMLElement, {
                    onChange: this.superCheck,
                    unCheckClass: 'btn-outline-info',
                    checkClass: 'btn-info',
                    extraClass: 'round',
                    activeValue: [ 'me', 'recurrent' ],
                    multiple: true
                }));
            } else {
                (new ButtonCheckGroup(document.getElementById('noSuperCheck') as HTMLElement, {
                    onChange: this.noSuperCheck,
                    unCheckClass: 'btn-outline-info',
                    checkClass: 'btn-info',
                    extraClass: 'round',
                    activeValue: [ 'recurrent' ],
                    multiple: true
                }));
            }
            new Search({
                callback: this.searchField,
                selector: "#searchTaskInput"
            });
            if (document.getElementById("taskCategoryIndex")) {
                (new DropdownSelect({
                    element: document.getElementById("taskCategoryIndex")!,
                    callback: this.setCategory
                })).load();
            }
            this.route = ROUTES.schedule.view[ (check.getValues()[ 0 ] as ScheduleType) ];
            $('[data-toggle="tooltip"]').tooltip();
            this.update();
        }
        Array.from(document.getElementsByClassName("schedule-day")).forEach(el => el.addEventListener("click", this.openDay));
        Array.from(document.getElementsByClassName("event")).forEach(el => el.addEventListener("click", async () => {
            const RECURRENT = +el.getAttribute("recurrent")!;
            const { default: Show } = await import('@scripts/schedule/show');
            (new Show({
                element: el as HTMLElement,
                recurrent: RECURRENT,
                callback: () => {
                    this.update(false);
                }
            })).load();
        }));
    };

    private update = async (spinner = true) => {
        spinner && (this.mainView.innerHTML = BIG_LOADER);
        try {
            const res = await Axios.get(
                Router.generate(this.route, {
                    'search': this.searchInput,
                    'offset': this.offset,
                    'me': this.me,
                    'finished': this.finished,
                    'category': this.category,
                    'showRecurrents': this.showRecurrents,
                })
            );
            this.mainView.innerHTML = res.data;
            this.load();
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    private setCategory = (value: string) => {
        this.category = +value;
        this.update();
    };

    private searchField = (data: string) => {
        this.searchInput = data.replace(/\//g, "_");
        this.update();
    };

    private addOffset = (value: number, set: boolean = false) => {
        if (set) {
            this.offset = value;
        } else {
            this.offset += value;
        }
        this.update();
    };

    private openDay = (e: Event) => {
        const ELEMENT = e.currentTarget as HTMLElement;
        const DAY = +ELEMENT.getAttribute("day")!;
        if (DAY) {
            const INFO_CONT = document.querySelector(`.schedule-info[day="${DAY}"]`) as HTMLElement;
            if (this.opened != 0) {
                if (DAY == this.opened) {
                    INFO_CONT.classList.remove("show");
                    this.opened = 0;
                } else {
                    Array.from(document.getElementsByClassName("schedule-info")).forEach(el => el.classList.remove("show"));
                    INFO_CONT.classList.add("show");
                    this.opened = DAY;
                }
            } else {
                INFO_CONT.classList.add("show");
                this.opened = DAY;
            }
        }
    };

    private changeType = (value: string[]) => {
        this.route = ROUTES.schedule.view[ (value[ 0 ] as ScheduleType) ];
        this.offset = 0;
        this.update();
    };

    private superCheck = (value: string[]) => {
        this.me = +value.includes('me');
        this.finished = +value.includes('finished');
        this.showRecurrents = +value.includes('recurrent');
        this.update(false);
    };

    private noSuperCheck = (value: string[]) => {
        this.finished = +value.includes('finished');
        this.showRecurrents = +value.includes('recurrent');
        this.update(false);
    };
}
