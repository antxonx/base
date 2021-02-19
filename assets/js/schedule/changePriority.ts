/**
* @packageDocumentation
* @module Schedule
*/
import { BIG_LOADER, Router, ROUTES } from "@scripts/app";
import Alert from "@scripts/plugins/Alert";
import Toast from "@scripts/plugins/AlertToast";
import ListSelect from "@scripts/plugins/ListSelect";
import Modal from "@scripts/plugins/Modal";
import Axios from "axios";

import { DEFAULT_SCHEDULE_ASIGN_OPTIONS, ScheduleAsignOptions, TASK_EDIT_TYPE } from "./defs";

export default class ChangePriority {

    protected options: ScheduleAsignOptions;

    protected modal: Modal;

    protected list: HTMLElement;

    public constructor (options: ScheduleAsignOptions) {
        this.options = { ...DEFAULT_SCHEDULE_ASIGN_OPTIONS, ...options };
        this.list = document.createElement("div") as HTMLElement;
        if (this.options.id == 0) {
            throw new Error("No se pudo identificar la tarea");
        }
        this.modal = new Modal({
            title: "cambiar prioridad",
            size: 40,
            onHide: this.options.callback
        });
    }

    public load = async () => {
        this.modal.show();
        try {
            const res = await Axios.get(
                Router.generate(
                    ROUTES.schedulePriority.view.changeForm,
                    {
                        'id': this.options.id!
                    }
                )
            );
            this.modal.updateBody(res.data);
            this.list = document.getElementById('priorityList') as HTMLElement;
            this.startEvents();
        } catch (err) {
            const e = err.response ? err.response.data : err;
            console.error(e);
            Toast.error(e);
            this.modal.hide();
        }
    };

    private listPriority = async (data: string[]) => {
        if (Array.isArray(data) && data.length) {
            const LIST_BEF = this.list.innerHTML;
            this.list.innerHTML = BIG_LOADER;
            const res = await (new Alert({
                typeText: "Cambiar prioridad",
                type: "info",
            }))
                .updateBody(`¿Seguro que desea cambiar la prioridad de la tarea?`)
                .show();
            if (res) {
                try {
                    await Axios.patch(
                        Router.generate(ROUTES.schedule.api.update),
                        {
                            id: this.options.id,
                            value: data[ 0 ],
                            type: TASK_EDIT_TYPE.PRIORITY,
                        }
                    );
                    this.modal.hide();
                } catch (err) {
                    const e = err.response ? err.response.data : err;
                    console.error(e);
                    Toast.error(e);
                }
                this.list.innerHTML = LIST_BEF;
                this.startEvents();
            }
            this.list.innerHTML = LIST_BEF;
            this.startEvents();
        }
    };

    private startEvents = () => {
        (new ListSelect({
            element: this.list,
            multiple: false,
            attribute: 'priority-id',
            callback: this.listPriority
        })).load();
    };
}
