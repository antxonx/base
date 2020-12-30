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
import Assign from "@scripts/schedule/assign";
import Delete from "@scripts/schedule/delete";
import ShowClient from '@scripts/client/show';
import ChangePriority from "./changePriority";

export default class Show {

    protected modal: Modal;

    protected options: ScheduleShowOptions;

    protected control: boolean;

    public constructor (options: ScheduleShowOptions) {
        this.options = { ...DEFAULT_SCHEDULE_SHOW_OPTIONS, ...options };
        this.control = true;
        this.options.id = this.options.id || +this.options.element!.getAttribute("event-id")!;
        this.options.bColor = this.options.bColor || this.options.element!.style.backgroundColor;
        this.options.tColor = this.options.tColor || this.options.element!.style.color;
        if (this.options.id == 0) {
            throw new Error("No se pudo determinar la tarea");
        }
        this.modal = new Modal({
            title: "Tarea",
            size: 50,
        });
    }

    public load = () => {
        if (this.control) {
            this.control = false;
            this.modal.show();
            this.update();
        }
        $('[data-toggle="tooltip"]').tooltip();
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
        document.getElementById("taskAssign")?.addEventListener("click", () => {
            this.modal.hide();
            (new Assign({
                id: this.options.id,
                callback: () => {
                    this.control = true;
                    this.load();
                    this.options.callback!();
                }
            })).asign();
        });
        document.getElementById("taskReassign")?.addEventListener("click", () => {
            this.modal.hide();
            (new Assign({
                id: this.options.id,
                callback: () => {
                    this.control = true;
                    this.load();
                    this.options.callback!();
                }
            })).asign(true);
        });
        document.getElementById("taskChangePriority")?.addEventListener("click", () => {
            this.modal.hide();
            (new ChangePriority({
                id: this.options.id,
                callback: () => {
                    this.control = true;
                    this.load();
                    this.options.callback!();
                }
            })).load();
        });
        document.getElementById("taskDelete")?.addEventListener("click", () => {
            (new Delete({
                id: this.options.id,
                callback: () => {
                    this.modal.hide();
                    this.options.callback!();
                },
            })).delete();
        });

        document.getElementById("openClientInfo")?.addEventListener("click", (e: Event) => {
            this.modal.hide();
            (new ShowClient({
                id: +((e.currentTarget as HTMLElement).getAttribute("client-id")!),
                callback: () => {
                    this.control = true;
                    this.load();
                }
            })).load();
        });
    };

    public update = () => {
        this.modal.loadingBody();
        Axios.get(Router.generate(ROUTES.schedule.view.show, { 'id': this.options.id }))
            .then(res => {
                this.modal.updateBody(res.data);
                this.load();
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    };
}
