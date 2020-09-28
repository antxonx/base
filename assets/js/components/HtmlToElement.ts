/**
 * @param {string} HTML representing a single element
 * @return {HTMLElement}
 */
export default function (html: string): HTMLElement {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
};