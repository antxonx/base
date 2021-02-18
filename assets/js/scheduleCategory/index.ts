/**
* view, add, edit and delete schedule categories
* @packageDocumentation
* @module Schedule/Category
* @preferred
*/

(async () => {
    const { default: ScheduleCategory } = await import("./scheduleCategory");
    (new ScheduleCategory()).load();
})();
