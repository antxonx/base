/**
* calendar view
* @packageDocumentation
* @module Schedule
* @preferred
*/

import Schedule from "./schedule";
import '@styles/schedule.sass';

(() => {
    (new Schedule()).load();
    $('[data-toggle="tooltip"]').tooltip();
})();
