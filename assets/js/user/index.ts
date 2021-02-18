/**
* view, add, edit and delete users
* @packageDocumentation
* @module User
* @preferred
*/

( async () => {
    const { default: User } = await import('@scripts/user/user');
    (new User).load();
})();
