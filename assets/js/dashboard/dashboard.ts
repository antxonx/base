/**
* @packageDocumentation
* @module Dashboard
*/

/**
 * load events for the principal view boards
 *
 * @export
 * @class Dashboard
 * @author Antxony <dantonyofcarim@gmail.com>
 */
export default class Dashboard {

    public load = () => {
        Array.from(document.getElementsByClassName("client-list")).forEach(el => el.addEventListener("click", this.client));
    };

    /**
    * Opens a client view
    */
    public client = async (e: Event) => {
        e.preventDefault();
        const { default: ShowClient } = await import("@scripts/client/show");
        const ID = +(e.currentTarget as HTMLElement).getAttribute("id")!;
        (new ShowClient({
            id: ID,
            callback: () => { }
        })).load();
    };
}
