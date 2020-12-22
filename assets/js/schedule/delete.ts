/**
* @packageDocumentation
* @module Schedule
*/
import { Router, ROUTES } from "@scripts/app";
import Alert from "@scripts/plugins/Alert";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";

import { ScheduleDeleteOptions, DEFAULT_SCHEDULE_DELETE_OPTIONS } from "./defs";

export default class Delete {

    protected options: ScheduleDeleteOptions;

    public constructor(options: ScheduleDeleteOptions) {
        this.options = {...DEFAULT_SCHEDULE_DELETE_OPTIONS, ...options};
        if(this.options.id == 0) {
            throw new Error("No se ha podido encontrar la tarea");
        }
    }

    public delete = async () => {
        const ALERT = new Alert({
            type: 'danger',
            typeText: 'Eliminar'
        });
        let res = await ALERT.updateBody(`¿Eliminar la tarea?`).show();
        if (res) {
            Axios.delete(Router.generate(ROUTES.schedule.api.delete, {'id': this.options.id!.toString()}))
                .then(res => {
                    Toast.success(res.data);
                    this.options.callback!();
                })
                .catch(err => {
                    console.error(err.response.data);
                    Toast.error(err.response.data);
                });
        }
    }
}
