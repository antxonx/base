let timer :  NodeJS.Timeout | undefined;

/**
 *Inicializa el búscador y llama a un callback cuando el input se actualice
 *
 * @param {string} componentSelector
 * @param {(data : string) => void} callback
 */
export const initialize = (componentSelector: string, callback: (data: string) => void) => {
    const COMPONENT = document.querySelector(componentSelector) as HTMLInputElement;
    COMPONENT.addEventListener("input", () => {
        if(timer != undefined){
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            const DATA = COMPONENT.value;
            timer = undefined;
            callback(DATA);
        }, 500);
    });
};
