let timer :  NodeJS.Timeout | undefined;

/**
 *Inicializa el búscador y llama a un callback cuando el input se actualice
 *
 * @param {string} componentSelector
 * @param {(data : string) => void} callback
 */
export const initialize = (componentSelector: string, callback: (data: string) => void) => {
    const COMPONENT = document.querySelector(componentSelector) as HTMLInputElement;
    const ERASE_COMPS = COMPONENT.closest('.search-input')!.getElementsByClassName('erase-search');
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
    if(ERASE_COMPS && ERASE_COMPS.length > 0) {
        ERASE_COMPS[0].addEventListener('click', () => {
            if(COMPONENT.value !== ""){
                COMPONENT.value = "";
                callback("");
            }
        })
    }

};
