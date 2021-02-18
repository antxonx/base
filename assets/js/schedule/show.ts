/**
* @packageDocumentation
* @module Schedule
*/
import Modal from "@scripts/plugins/Modal";
import Axios from "axios";
import { DEFAULT_SCHEDULE_SHOW_OPTIONS, ScheduleShowOptions, TASK_EDIT_TYPE } from "./defs";
import { Router, ROUTES, SPINNER_LOADER } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Finish from "@scripts/schedule/finish";
import Assign from "@scripts/schedule/assign";
import Delete from "@scripts/schedule/delete";
import ShowClient from '@scripts/client/show';
import ChangePriority from "./changePriority";
import { isThisTypeNode, textChangeRangeIsUnchanged } from "typescript";
import moment from "moment";
import Obs from "@scripts/plugins/Obs";

export default class Show {

    protected modal: Modal;

    protected date: string;

    protected options: ScheduleShowOptions;

    protected control: boolean;

    protected readonly datePicker = '<div class="m-2"><div class="form-group" style="position: relative;"><input type="text" t-type="text" name="taskDate" class="form-control required datepicker cursor-pointer" id="taskDate" aria-describedby="taskDateHelp" placeholder="Fecha" error-msg="Seleccione una fecha y hora" value=""readonly></div><div class="text-center"><button id="updateTaskDate" class="btn btn-sm btn-success round">Actualizar</button></div>';

    protected temporalString: string;

    public constructor (options: ScheduleShowOptions) {
        this.options = { ...DEFAULT_SCHEDULE_SHOW_OPTIONS, ...options };
        this.control = true;
        this.options.id = this.options.id || +this.options.element!.getAttribute("event-id")!;
        this.options.bColor = this.options.bColor || this.options.element!.style.backgroundColor;
        this.options.tColor = this.options.tColor || this.options.element!.style.color;
        this.temporalString = "";
        this.date = "";
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
        document.getElementById("scheduleChangeDate")?.addEventListener("click", (e: Event) => {
            const CONT = document.getElementById("actualDateContainer")!;
            const ELEMENT = e.currentTarget as HTMLElement;
            if (ELEMENT.getAttribute("status") == "0") {
                this.temporalString = CONT.innerHTML;
                CONT.innerHTML = this.datePicker;
                const TASK_DATE = document.getElementById("taskDate") as HTMLInputElement;
                $(TASK_DATE).daterangepicker({
                    singleDatePicker: true,
                    showDropdowns: true,
                    timePicker: true,
                    locale: {
                        format: "DD/MM/YYYY LT",
                        separator: " - ",
                        applyLabel: "Aceptar",
                        cancelLabel: "Cancelar",
                        fromLabel: "De",
                        toLabel: "a",
                        customRangeLabel: "Custom",
                        weekLabel: "W",
                        daysOfWeek: [
                            "Do",
                            "Lu",
                            "Ma",
                            "Mi",
                            "Ju",
                            "Vi",
                            "Sa"
                        ],
                        monthNames: [
                            "Enero",
                            "Febrero",
                            "Marzo",
                            "Abril",
                            "Mayo",
                            "Junio",
                            "Julio",
                            "Agosto",
                            "Septiembre",
                            "Octubre",
                            "Noviembre",
                            "Deciembre"
                        ],
                        firstDay: 1
                    },
                    buttonClasses: [ "btn btn-sm round" ],
                    cancelButtonClasses: "btn-secondary",
                    applyButtonClasses: "btn-antxony",
                    startDate: moment(CONT.getAttribute("date")),
                    parentEl: TASK_DATE.parentElement as Element
                }, (start) => {
                    this.date = start.format('DD-MM-YYYY kk:mm:ss');
                });
                this.date = moment(CONT.getAttribute("date")).format('DD-MM-YYYY kk:mm:ss');
                TASK_DATE.value = moment(CONT.getAttribute("date")).format('DD/MM/YYYY LT');
                ELEMENT.setAttribute("status", "1");
                document.getElementById("updateTaskDate")!.addEventListener("click", () => {
                    this.updateDate(CONT);
                });
            } else {
                CONT.innerHTML = this.temporalString;
                this.temporalString = "";
                ELEMENT.setAttribute("status", "0");
            }
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
        Axios.get(Router.generate(ROUTES.schedule.view.show, {
            'id': this.options.id,
            'recurrent': this.options.recurrent
        }))
            .then(res => {
                this.modal.updateBody(res.data);
                this.load();
                (new Obs({
                    element: document.getElementById("taskObsView")!,
                    entity: this.options.recurrent ? "ScheduleRecurrent" : "Schedule",
                    id: this.options.id!,
                    callback: this.options.callback!
                })).load();
            })
            .catch(err => {
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    };

    private updateDate = (container: HTMLElement) => {
        container.innerHTML = SPINNER_LOADER;
        Axios.patch(Router.generate(ROUTES.schedule.api.update), {
            id: this.options.id!,
            value: this.date,
            type: TASK_EDIT_TYPE.DATE
        })
            .then(res => {
                Toast.success(res.data);
                this.update();
                this.options.callback!();
            })
            .catch(err => {
                container.innerHTML = this.temporalString;
                console.error(err);
                console.error(err.response.data);
                Toast.error(err.response.data);
            });
    };
}
