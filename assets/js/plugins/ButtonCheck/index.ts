/**
 * ButtonCheck class
 *
 * @export
 * @class ButtonCheck
 */
export default class ButtonCheck {
    /**
     * Button element
     *
     * @private
     * @type {HTMLButtonElement}
     * @memberof ButtonCheck
     */
    private readonly button: HTMLButtonElement;

    /**
     * On state change callback
     *
     * @private
     * @memberof ButtonCheck
     */
    private readonly onChange: (buttonCheck: ButtonCheck) => void;

    /**
     * Button status
     *
     * @private
     * @type {boolean}
     * @memberof ButtonCheck
     */
    private status: boolean;

    /**
     * Button id
     *
     * @private
     * @type {string}
     * @memberof ButtonCheck
     */
    private readonly id: string;

    /**
     * Creates an instance of ButtonCheck.
     * @param {HTMLButtonElement} button
     * @param {(buttonCheck : ButtonCheck) => void} [onChange=() => {}]
     * @param {boolean} [status=false]
     * @memberof ButtonCheck
     */
    public constructor(
        button: HTMLButtonElement,
        onChange: (buttonCheck: ButtonCheck) => void = () => {
        },
        status = false
    ) {
        this.button = button;
        this.onChange = onChange;
        this.status = status;
        this.id = this.button.getAttribute("id")!;
        this.button.addEventListener("click", this.toggleState);
    }

    /**
     * unmark Active
     *
     * @memberof ButtonCheck
     */
    public unmarkActive() {
        this.button.classList.remove("btn-success");
        this.button.classList.add("btn-outline-success");
        this.status = false;
    }

    /**
     * Change status and visuals
     *
     * @memberof ButtonCheck
     */
    public toggleState = () => {
        const STATE = this.status;
        if (STATE) {
            this.button.classList.remove("btn-success");
            this.button.classList.add("btn-outline-success");
        } else {
            this.button.classList.add("btn-success");
            this.button.classList.remove("btn-outline-success");
        }
        this.status = !STATE;
        this.onChange(this);
    };

    /**
     * get button status
     *
     * @returns {boolean}
     * @memberof ButtonCheck
     */
    public getStatus(): boolean {
        return this.status;
    };

    /**
     * get button id
     *
     * @returns {string}
     * @memberof ButtonCheck
     */
    public getId(): string {
        return this.id;
    }
}
