/**
* view, add, edit and delete clients
* @packageDocumentation
* @module Client
* @preferred
*/

(async () => {
    const { default: Client } = await import("@scripts/client/client");
    (new Client()).load();
})();
