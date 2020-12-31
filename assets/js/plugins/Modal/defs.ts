/**
 * @packageDocumentation
 * @module Modal
 */

export interface ModalOptions {
    title?: string;
    size?: number;
    onHide?: () => void;
}

export const DEFAULT_MODAL_OPTIONS: ModalOptions = {
    title: 'View',
    size: 70,
    onHide: () => { },
};

export const MODAL_LOADER = '<div class="loader"></div>';

export enum ModalIds {
    MODAL = 'modal_',
    LABEL = 'modalLabel_',
    DIALOG = 'modalDialog',
    TITLE = 'modalTitle_',
    BODY = 'modalBody_',
}
