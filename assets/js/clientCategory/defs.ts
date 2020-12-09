/**
 * ClientCategoryOptions interface
 *
 * @export
 * @interface ClientCategoryOptions
 */
export interface ClientCategoryOptions {
    control?: boolean,
    extern?: boolean,
}

export const DEFAULT_CLIENT_CATEGORY_OPTIONS: ClientCategoryOptions = {
    control: true,
    extern: false
};
