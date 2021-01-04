/**
* @packageDocumentation
* @module Config
*/

import { ConfigTypes, Router, ROUTES } from "@scripts/app";
import Toast from "@scripts/plugins/AlertToast";
import Axios from "axios";

export interface ConfigOptions {
    type: ConfigTypes;
    restore?: boolean;
    callback?: () => void;
}

/**
 * update config
 *
 * @export
 * @class Config
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Config{

    protected options: ConfigOptions;

    public constructor(options: ConfigOptions) {
        this.options = options;
        this.options.restore = options.restore || false;
    }

    public load = () => {
        switch(this.options.type)
        {
            case ConfigTypes.TaskCommentedBorder:
                this.taskCommentedBorder();
                break;
            case ConfigTypes.TaskDoneColors:
                this.taskDoneColors();
                break;
            default:
                throw new Error("no se encontró la configuración");
                break;
        }
    }

    private taskCommentedBorder = () => {
        let data = {};
        if(!this.options.restore) {
            data = {
                style: (document.getElementById("obsBorderInput") as HTMLInputElement).value
            };
        }
        this.send(data);
    }

    private taskDoneColors = () => {
        let data = {};
        if(!this.options.restore) {
            data = {
                "background-color": (document.getElementById("bColor") as HTMLInputElement).value,
                color: (document.getElementById("tColor") as HTMLInputElement).value
            };
        }
        this.send(data);
    }

    private send = (data: any) => {
        const route = ((this.options.restore)?ROUTES.configuration.api.restore:ROUTES.configuration.api.update)
        Axios.put(Router.generate(route, {'type': this.options.type}), data)
        .then(res => {
            Toast.success(res.data);
            this.options.callback && this.options.callback();
        })
        .catch(err => {
            console.error(err);
            console.error(err.response.data);
            Toast.error(err.response.data);
        });
    }


}