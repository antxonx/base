/**
 * @packageDocumentation
 * @module Obs
 */

export interface ObsOptions {
    element: HTMLElement;
    entity: string;
    id: number;
}

export interface ObsI {
    createdAt: {
        date: string;
        time: string;
    };
    createdBy: string;
    description: string;
    customClass: string;
};