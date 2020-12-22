/**
* @packageDocumentation
* @module Schedule
*/
import Modal from "@scripts/plugins/Modal";
import Axios from "axios";
import { DEFAULT_SCHEDULE_SHOW_OPTIONS, ScheduleShowOptions } from "./defs";
import { Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Finish from "@scripts/schedule/finish";

export default class Show {

    protected modal: Modal;

    protected options: ScheduleShowOptions

    protected control: boolean;

    public constructor(options: ScheduleShowOptions) {
        this.options = {...DEFAULT_SCHEDULE_SHOW_OPTIONS, ...options};
        this.control = true;
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
        if(this.control) {
            this.control = false;
            this.modal.show();
            this.update();
        }
        document.getElementById("taskFinish")?.addEventListener("click", () => {
            (new Finish({
                id: this.options.id!,
                callback: () => {
                    this.update();
                    this.options.callback!();
                }
            })).finish();
        });
        document.getElementById("taskReactive")?.addEventListener("click", () => {
            (new Finish({
                id: this.options.id!,
                callback: () => {
                    this.update();
                    this.options.callback!();
                }
            })).finish(true);
        });
    }

    public update = () => {
        this.modal.loadingBody();
        Axios.get(Router.generate(ROUTES.schedule.view.show, {'id': this.options.id}))
        .then(res => {
            this.modal.updateBody(res.data);
            this.load();
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        })
    }
}
