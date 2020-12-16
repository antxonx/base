/**
* @packageDocumentation
* @module Calendar
*/

import { Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";

export default class Calendar {

    protected control: boolean;

    protected mainView: HTMLElement;

    public constructor() {
        this.control = true;
        this.mainView = document.getElementById("CalendarView") || document.createElement("div");
    }

    public load = () => {
        if(this.control) {
            this.control = false;
            this.update();
        }
    }

    public update = () => {
        Axios.get(Router.generate(ROUTES.calendar.view.view))
        .then(res => {
            this.mainView.innerHTML = res.data;
        })
        .catch(err => {
            console.error(err.response.data);
            Toast.error(err.response.data);
        })
    }
}
