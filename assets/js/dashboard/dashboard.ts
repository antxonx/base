/**
* @packageDocumentation
* @module Dashboard
*/
import ShowClient from "@scripts/client/show";

/**
 * load events for the principal view boards
 *
 * @export
 * @class Dashboard
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Dashboard {

    public load = () => {
        [...document.getElementsByClassName("client-list")].forEach(el => el.addEventListener("click", this.client));
    }

    /**
    * Opens a client view
    */
    public client = (e: Event) => {
        e.preventDefault();
        const ID = +(e.currentTarget as HTMLElement).getAttribute("id")!;
        (new ShowClient({
            id: ID,
            callback: () => {}
        })).load();
    }
}
