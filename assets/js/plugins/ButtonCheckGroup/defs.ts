/**
 * Check button options
 *
 * @export
 * @interface checkOptions
 */
export interface checkOptions {
    onChange?: (value: string[]) => void;
    multiple?: boolean
    unCheckClass?: string;
    checkClass?: string;
    extraClass?: string;
}

/**
 * Check button attribute names
 *
 * @export
 * @enum checkAttributes
 */
export enum checkAttributes {
    STATUS = 'status',
    ID = 'id',
    VALUE = 'value'
}

/**
 * Default options
 */
export const DEFAULT_CHECK_OPTIONS: checkOptions = {
    onChange: () => {},
    multiple: false,
    unCheckClass: 'button-check-unchecked',
    checkClass: 'button-check-checked',
    extraClass: ''
}
