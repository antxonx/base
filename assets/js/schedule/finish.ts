import { Router, ROUTES } from "@scripts/app";
import Alert from "@scripts/plugins/Alert";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";
/**
* @packageDocumentation
* @module Schedule
*/

import { ScheduleFinishOptions, DEFAULT_SCHEDULE_FINISH_OPTIONS } from "./defs";

export default class Finish {

    protected options: ScheduleFinishOptions;

    public constructor (options: ScheduleFinishOptions) {
        this.options = { ...DEFAULT_SCHEDULE_FINISH_OPTIONS, ...options };
        if (this.options.id == 0) {
            throw new Error("No se pudo determinar loa tarea");
        }
    }

    public finish = async (reactivate = false) => {
        let msgText: string;
        if (reactivate) {
            msgText = 'reactivar';
        } else {
            msgText = 'finalizar';
        }
        const ALERT = new Alert({
            type: 'info',
            typeText: msgText.charAt(0).toUpperCase() + msgText.slice(1)
        });
        let res = await ALERT.updateBody(`¿Desea <b>${msgText}</b> la tarea?`).show();
        if (res) {
            try {
                const res = await Axios.post(
                    Router.generate(ROUTES.schedule.api.done),
                    {
                        id: this.options.id,
                        done: !reactivate
                    }
                );
                Toast.success(res.data);
                this.options.callback!();
            } catch (err) {
                const e = err.response ? err.response.data : err;
                console.error(e);
                Toast.error(e);
            }
        }
    };
}
