/**
* view, add, edit and delete client categories
* @packageDocumentation
* @module Client/Category
* @preferred
*/

(async () => {
    const { default: ClientCategory } = await import("@scripts/clientCategory/clientCategory");
    (new ClientCategory()).load();
})();
