/**
* view, add, edit and delete priorities
* @packageDocumentation
* @module Schedule/Priority
* @preferred
*/

(async () => {
    const { default: SchedulePriority } = await import("@scripts/schedulePriority/schedulePriority");
    (new SchedulePriority()).load();
})();
