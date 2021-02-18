/**
* visualize your user profile and edit it
* @packageDocumentation
* @module Profile
* @preferred
*/

(async () => {
    const { default: Profile } = await import("@scripts/profile/profile");
    (new Profile()).load();
})();
