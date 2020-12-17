/**
* calendar view
* @packageDocumentation
* @module Schedule
* @preferred
*/

import Schedule from "./schedule";

(() => {
    (new Schedule()).load();
    $('[data-toggle="tooltip"]').tooltip();
})();
