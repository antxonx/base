/**
* visualize error and info logs
* @packageDocumentation
* @module Logger
* @preferred
*/

(async () => {
    const { default: Logger } = await import("./logger");
    (new Logger().load());
})();
