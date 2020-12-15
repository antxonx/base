/** @module Dashboard */
import ShowClient from "@scripts/client/show";

/**
 * Dashboard class
 *
 * @export
 * @class Dashboard
 * @classdesc Principal view with boards
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Dashboard {

    public load = () => {
        [...document.getElementsByClassName("client-list")].forEach(el => el.addEventListener("click", this.client));
    }

    public client = (e: Event) => {
        e.preventDefault();
        const ID = +(e.currentTarget as HTMLElement).getAttribute("id")!;
        (new ShowClient({
            id: ID,
            callback: () => {}
        })).load();
    }
}
