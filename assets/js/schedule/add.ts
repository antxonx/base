/**
* @packageDocumentation
* @module Schedule
*/
import Modal from '@scripts/plugins/Modal';
import 'daterangepicker';
import 'daterangepicker/daterangepicker.css';
import Axios from 'axios';
import { ROUTES, Router, SPINNER_LOADER } from '@scripts/app';
import Toast from '@scripts/plugins/AlertToast';
import { evaluateInputs, insertAlertAfter } from '@scripts/plugins/Required';
import DropdownSelect from '@scripts/plugins/DropdownSelect';
import moment from 'moment';
import ClientSearch from '@scripts/client/searchClient';
import Alert from '@scripts/plugins/Alert';
import ListSelect from '@scripts/plugins/ListSelect';

import 'bootstrap/js/dist/tab';

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

    protected categorySelect: DropdownSelect;

    protected prioritySelect: DropdownSelect;

    protected userSelect: DropdownSelect;

    protected selectedClient: ClientSearch | null;

    protected yearMonthList?: ListSelect;
    protected yearDayList?: ListSelect;
    protected monthDayList?: ListSelect;
    protected weekDayList?: ListSelect;

    public constructor (callback: () => void = () => { }) {
        this.callback = callback;
        this.selectedClient = null;
        this.modal = (new Modal({
            title: "Nueva tarea",
            size: 60
        }));
        this.date = '';
        this.categorySelect = new DropdownSelect();
        this.prioritySelect = new DropdownSelect();
        this.userSelect = new DropdownSelect();
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(Router.generate(ROUTES.schedule.view.form));
            this.modal.updateBody(res.data);
            document.getElementById("scheduleForm")!.addEventListener("submit", this.validate);
            const TASK_DATE = document.getElementById("taskDate") as HTMLInputElement;
            this.categorySelect = (new DropdownSelect({
                element: document.getElementById("taskCategory")!,
                callback: this.loadUsers
            })).load();
            this.prioritySelect = (new DropdownSelect({
                element: document.getElementById("taskPriority")!
            })).load();
            this.selectedClient = new ClientSearch("#searchClientForm");
            //List select
            this.yearMonthList = new ListSelect({
                element: document.getElementById('yearlyMonthSelect') as HTMLElement,
                multiple: true,
                attribute: 'month-number',
            });
            this.yearDayList = new ListSelect({
                element: document.getElementById('yearlyDaySelect') as HTMLElement,
                multiple: true,
                attribute: 'month-day-number',
            });
            this.monthDayList = new ListSelect({
                element: document.getElementById('monthlyDaySelect') as HTMLElement,
                multiple: true,
                attribute: 'day-number',
            });
            this.weekDayList = new ListSelect({
                element: document.getElementById('weeklyDaySelect') as HTMLElement,
                multiple: true,
                attribute: 'week-day-number',
            });
            this.yearMonthList.load();
            this.yearDayList.load();
            this.monthDayList.load();
            this.weekDayList.load();
            // ----
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
                startDate: moment(),
                parentEl: TASK_DATE.parentElement as Element
            }, (start) => {
                this.date = start.format('DD-MM-YYYY kk:mm:ss');
            });
            this.date = moment().format('DD-MM-YYYY kk:mm:ss');
            TASK_DATE.value = moment().format('DD/MM/YYYY LT');
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
            this.modal.hide();
        }
    };

    private validate = async (e: Event) => {
        let res: boolean;
        e.preventDefault();
        if (evaluateInputs(
            Array.from(document.getElementsByClassName("required")) as HTMLInputElement[],
            0
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            const recurrent = (this.getActiveTab("scheduleTab") === "recurrent-tab");
            let recType = 0;
            let recData: string[] | string[][] = [];
            let recError = false;
            let recErrorMsg = "";
            if (recurrent) {
                switch (this.getActiveTab("v-pills-tab")) {
                    case "v-pills-yearly-tab":
                        recType = 1;
                        if (this.yearMonthList!.getValues()!.length == 0 || this.yearDayList!.getValues()!.length == 0) {
                            recError = true;
                            recErrorMsg = "Debe seleccionar al menos un mes y un día";
                            break;
                        }
                        recData = [ this.yearMonthList!.getValues()!, this.yearDayList!.getValues()! ];
                        break;
                    case "v-pills-monthly-tab":
                        recType = 2;
                        if (this.monthDayList!.getValues()!.length == 0) {
                            recError = true;
                            recErrorMsg = "Debe seleccionar al menos un día";
                            break;
                        }
                        recData = this.monthDayList!.getValues()!;
                        break;
                    case "v-pills-weekly-tab":
                        recType = 3;
                        if (this.weekDayList!.getValues()!.length == 0) {
                            recError = true;
                            recErrorMsg = "Debe seleccionar al menos un día";
                            break;
                        }
                        recData = this.weekDayList!.getValues()!;
                        break;
                    default:
                        break;
                }
            }
            const DATA = {
                name: (document.getElementById("title") as HTMLInputElement).value,
                detail: (document.getElementById("taskDetail") as HTMLInputElement).value,
                date: this.date,
                category: this.categorySelect.getValue(),
                priority: this.prioritySelect.getValue(),
                user: this.userSelect.getValue(),
                client: this.selectedClient!.getClientId(),
                recurrent: recurrent,
                recType: recType,
                recData: recData,
            };
            if (recError) {
                insertAlertAfter(document.getElementById("scheduleForm")!, recErrorMsg);
                return;
            }
            if (!DATA.date) {
                insertAlertAfter(document.getElementById("scheduleForm")!, "No se ha ingresado la fecha");
                return;
            }
            if (!DATA.category) {
                insertAlertAfter(document.getElementById("scheduleForm")!, "No se ha seleccionado la categoría");
                return;
            }
            if (!DATA.priority) {
                insertAlertAfter(document.getElementById("scheduleForm")!, "No se ha seleccionado la prioridad");
                return;
            }
            if (DATA.client == 0) {
                const ALERT = new Alert({
                    type: 'warning',
                    typeText: 'Agregar tarea',
                });
                res = await ALERT.updateBody("¿Desea agregar esta tarea sin seleccionar a un cliente?").show();
            } else {
                res = true;
            }
            if (res) {
                BTN.innerHTML = SPINNER_LOADER;
                try {
                    const res = await Axios.post(Router.generate(ROUTES.schedule.api.add), DATA);
                    Toast.success(res.data);
                    this.modal.hide();
                    this.callback();
                } catch (err) {
                    const e = err.response ? err.response.data : err;
                    insertAlertAfter(BTN, e);
                    console.error(e);
                    BTN.innerHTML = BEF;
                }
            }
        }
    };

    private loadUsers = async (category: string) => {
        document.getElementById("user-select-container")!.innerHTML = SPINNER_LOADER;
        try {
            const res = await Axios.get(Router.generate(ROUTES.user.api.getByRole, { 'id': category }));
            document.getElementById("user-select-container")!.innerHTML = '<div class="dropdow-arrow"><input id="taskUser" value="" placeholder="Asignar" class="form-control readonly-click cursor-pointer" options=[]" readonly></div>';
            document.getElementById("taskUser")!.setAttribute("options", JSON.stringify(res.data));
            this.userSelect = (new DropdownSelect({
                element: document.getElementById("taskUser")!
            })).load();
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
        }
    };

    private getActiveTab = (id: string): string => {
        const TAB = document.getElementById(id) as HTMLElement;
        return TAB.querySelector(".nav-link.active")!.getAttribute("id")!;
    };
}
