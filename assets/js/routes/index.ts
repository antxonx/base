/**
 * Defined routes from symfony
 * @packageDocumentation
 * @module Routes
 * @preferred
 */

export const Routes = {
    client: {
        view: {
            list: 'client_list',
            form: 'client_form',
            show: 'client_show'
        },
        api: {
            add: 'client_add',
            delete: 'client_delete'
        },
        address: {
            view: {
                form: 'client_address_form'
            },
            api: {
                add: 'client_address_add'
            }
        },
        extra: {
            api: {
                add: 'client_extra_add',
                delete: 'client_extra_delete'
            }
        },
        contact: {
            view:{
                form: 'client_contact_form',
                show: 'client_contact_show'
            },
            api:{
                add: 'client_contact_add',
                delete: 'client_contact_delete',
            },
            extra:{
                api:{
                    add: 'client_contact_extra_add',
                    delete: 'client_contact_extra_delete'
                }
            }
        }
    },
    clientCategory: {
        view: {
            list: 'client_category_list',
            form: 'client_category_add_form',
            show: 'client_category_show',
            changeForm: 'client_category_change_form',
        },
        api: {
            add: 'client_category_add',
            update: 'client_category_change',
            delete: 'client_category_delete'
        }
    },
    user: {
        view: {
            list: 'user_list',
            passform: 'user_profile_pass_form',
            form: 'user_form',
            show: 'user_show',
            key: 'user_key',
        },
        api: {
            passchange: 'user_profile_pass_change',
            add: 'user_add',
            delete: 'user_delete',
            key: 'user_key_update',
            reactive: 'user_reactivate'
        }
    },
    logger: {
        view: {
            index: 'logger_index',
            info: 'logger_info_list',
            error: 'logger_error_list'
        }
    },
    calendar: {
        view: {
            month: 'schedule_month'
        }
    }
}
