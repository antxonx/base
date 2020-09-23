import $ from 'jquery';
/**
 *Inicializa el búscador y llama a un callback cuando el input se actualice
 *
 * @param {string} componentSelector
 * @param {(data : string) => void} callback
 */
export const initialize = (componentSelector: string, callback: (data: string) => void) => {
    const COMPONENT = document.querySelector(componentSelector) as HTMLInputElement;
    COMPONENT.addEventListener("input", (e: Event) => {
        clearTimeout($.data(e.currentTarget!, 'timer'));
        $(e.currentTarget!).data('timer', setTimeout(() => {
            const DATA = COMPONENT.value;
            callback(DATA);
        }, 500));
    });
};