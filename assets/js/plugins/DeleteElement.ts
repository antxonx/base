/** 
 * Eliminar un elemento del DOM
 * 
 * @param {HTMLElement} element
 */
export default (element: HTMLElement) => {
    element?.parentNode?.removeChild(element);
};