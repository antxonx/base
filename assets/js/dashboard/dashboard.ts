import ShowClient from "@scripts/client/show";

/**
 * Dashboard class
 *
 * @export
 * @class Dashboard
 */
export default class Dashboard {

    /**
     * load
     *
     * @memberof Dashboard
     */
    public load = () => {
        [...document.getElementsByClassName("client-list")].forEach(el => el.addEventListener("click", this.client));
    }

    /**
     * client
     *
     * @memberof Dashboard
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
