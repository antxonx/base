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
    createdAt: string;
    createdBy: string;
    description: string;
    customClass: string;
};