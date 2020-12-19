/**
* @packageDocumentation
* @module Schedule
*/
import Modal from '@scripts/plugins/Modal';
import 'daterangepicker';
import 'daterangepicker/daterangepicker.css';
import Axios from 'axios';
import {ROUTES, Router, SPINNER_LOADER} from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import {evaluateInputs, insertAlertAfter} from '@scripts/plugins/Required';

/**
 * Add a new task
 *
 * @export
 * @class Add
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Add {

    protected modal: Modal;

    protected callback: () => void;

    protected date: string;

    public constructor(callback: () => void = () => {}) {
        this.callback = callback;
        this.modal = (new Modal({
            title: "Nueva tarea",
            size: 50
        }));
        this.date = '';
    }

    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.schedule.view.form))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("scheduleForm")!.addEventListener("submit", this.validate);
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
                    buttonClasses: ["btn btn-sm round"],
                    cancelButtonClasses: "btn-secondary",
                    applyButtonClasses: "btn-antxony",
                    parentEl: TASK_DATE.parentElement as Element
                }, (start) => {
                  this.date = start.format('x');
                });
                TASK_DATE.value = "";
            })
            .catch(err => {
                console.error(err);
                console.error(err.response.data);
                Toast.error(err.response.data);
                this.modal.hide();
            });
    }

    private validate = (e: Event) => {
        e.preventDefault();
        if (evaluateInputs(
            [...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement>],
            0
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            // BTN.innerHTML = SPINNER_LOADER;
            const DATA = {
                name: (document.getElementById("title") as HTMLInputElement).value,
                date: this.date,
                category: (document.getElementById("category-select") as HTMLInputElement).value,
                priority: (document.getElementById("priority-select") as HTMLInputElement).value,
            }
            if(DATA.date == '') {

            }
            console.log(DATA);
            // Axios.post(Router.generate(ROUTES.schedule.api.add), DATA)
            //     .then(res => {
            //         Toast.success(res.data);
            //         this.modal.hide();
            //         this.callback();
            //     })
            //     .catch(err => {
            //         insertAlertAfter(BTN, err.response.data);
            //         console.error(err.response.data);
            //         BTN.innerHTML = BEF;
            //     });
        }
    }
}
