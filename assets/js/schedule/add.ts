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

    protected selectedClient: ClientSearch|null;

    public constructor (callback: () => void = () => { }) {
        this.callback = callback;
        this.selectedClient = null;
        this.modal = (new Modal({
            title: "Nueva tarea",
            size: 40
        }));
        this.date = '';
        this.categorySelect = new DropdownSelect();
        this.prioritySelect = new DropdownSelect();
        this.userSelect = new DropdownSelect();
    }

    public load = () => {
        this.modal.show();
        Axios.get(Router.generate(ROUTES.schedule.view.form))
            .then(res => {
                this.modal.updateBody(res.data);
                document.getElementById("scheduleForm")!.addEventListener("submit", this.validate);
                const TASK_DATE = document.getElementById("taskDate") as HTMLInputElement;
                this.categorySelect = (new DropdownSelect({
                    element: document.getElementById("taskCategory")!
                })).load();
                this.prioritySelect = (new DropdownSelect({
                    element: document.getElementById("taskPriority")!
                })).load();
                this.userSelect = (new DropdownSelect({
                    element: document.getElementById("taskUser")!
                })).load();
                this.selectedClient = new ClientSearch("#searchClientForm");
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
            })
            .catch(err => {
                console.error(err);
                console.error(err.response.data);
                Toast.error(err.response.data);
                this.modal.hide();
            });
    };

    private validate = async (e: Event) => {
        let res: boolean;
        e.preventDefault();
        if (evaluateInputs(
            [ ...document.getElementsByClassName("required") as HTMLCollectionOf<HTMLInputElement> ],
            0
        )) {
            const BTN = document.getElementById("submit-btn") as HTMLButtonElement;
            const BEF = BTN.innerHTML;
            const DATA = {
                name: (document.getElementById("title") as HTMLInputElement).value,
                detail: (document.getElementById("taskDetail") as HTMLInputElement).value,
                date: this.date,
                category: this.categorySelect.getValue(),
                priority: this.prioritySelect.getValue(),
                user: this.userSelect.getValue(),
                client: this.selectedClient!.getClientId(),
            };
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
            if(DATA.client == 0) {
                const ALERT = new Alert({
                    type: 'warning',
                    typeText: 'Agregar tarea',
                });
                res = await ALERT.updateBody("¿Desea agregar esta tarea sin seleccionar a un cliente?").show();
            } else {
                res = true;
            }
            if(res) {
                BTN.innerHTML = SPINNER_LOADER;
                Axios.post(Router.generate(ROUTES.schedule.api.add), DATA)
                    .then(res => {
                        Toast.success(res.data);
                        this.modal.hide();
                        this.callback();
                    })
                    .catch(err => {
                        insertAlertAfter(BTN, err.response.data);
                        console.error(err.response.data);
                        BTN.innerHTML = BEF;
                    });
            }
        }
    };
}
