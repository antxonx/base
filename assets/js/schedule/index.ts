/**
* calendar view
* @packageDocumentation
* @module Schedule
* @preferred
*/

(async () => {
    const { default: Schedule } = await import("./schedule");
    (new Schedule()).load();
    
})();
