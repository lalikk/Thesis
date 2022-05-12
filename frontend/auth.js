import { CHECK_VALID_LOGIN } from './js-modules/authorisation-check.js'

$(async () => {
    if (await CHECK_VALID_LOGIN()) {
        document.querySelector("#a-routes-edit").classList.toggle("d-none", false);
        document.querySelector("#a-points-edit").classList.toggle("d-none", false);
        document.querySelector("#li-logout").classList.toggle("d-none", false);
        document.querySelector("#li-login").classList.toggle("d-none", true);
    }
})