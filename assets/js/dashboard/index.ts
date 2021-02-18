/**
* dashboard view
* @packageDocumentation
* @module Dashboard
* @preferred
*/
import '@components/simplecard';

(async () => {
    const { default: Dashboard } = await import("@scripts/dashboard/dashboard");
    (new Dashboard()).load();
})();
