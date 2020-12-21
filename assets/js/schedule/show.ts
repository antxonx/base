import { Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
/**
* @packageDocumentation
* @module Schedule
*/
import Modal from "@scripts/plugins/Modal";
import Axios from "axios";
import { DEFAULT_SCHEDULE_SHOW_OPTIONS, ScheduleShowOptions } from "./defs";

export default class Show {

    protected modal: Modal;

    protected options: ScheduleShowOptions

    public constructor(options: ScheduleShowOptions) {
        this.options = {...DEFAULT_SCHEDULE_SHOW_OPTIONS, ...options};
        this.options.id = this.options.id || +this.options.element!.getAttribute("event-id")!;
        this.options.bColor = this.options.bColor || this.options.element!.style.backgroundColor;
        this.options.tColor = this.options.tColor || this.options.element!.style.color;
        if(this.options.id == 0) {
            throw new Error("No se pudo determinar la tarea");
        }
        console.log(this.options);
        this.modal = new Modal({
            title: "Tarea",
            size: 50,
        });
    }

    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.schedule.view.show, {'id': this.options.id}))
        .then(res => {
            this.modal.updateBody(res.data);
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        })
    }
}
