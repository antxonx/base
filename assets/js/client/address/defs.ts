/**
 * addOptions
 *
 * @export
 * @interface AddOptions
 */
export interface AddOptions {
    id: number;
    callback?: () => void;
}

export const DEFAULT_ADD_OPTIONS : AddOptions = {
    id: 0,
    callback: () => {}
};
