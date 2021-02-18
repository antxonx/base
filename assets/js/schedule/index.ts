/**
* calendar view
* @packageDocumentation
* @module Schedule
* @preferred
*/

import Schedule from "./schedule";
import '@styles/schedule.scss';

(() => {
    (new Schedule()).load();
    $('[data-toggle="tooltip"]').tooltip();
})();
