import { URL_USER_LOGIN } from './js-modules/constants.js';
import { CHECK_VALID_LOGIN } from './js-modules/authorisation-check.js'
import Cookies from './node_modules/js-cookie/dist/js.cookie.mjs'

$(async () => {
    let isLoggedIn = await CHECK_VALID_LOGIN();
    console.log(isLoggedIn, "logged");
})

window.sendLogin = async function() {
    console.log("Send login reached");
    let loginInfo = {};
    loginInfo.login = document.getElementById("email").value;
    loginInfo.password = document.getElementById("password").value;
    let loginJSON = JSON.stringify(loginInfo);
    console.log(loginInfo);
    await $.ajax({
        url:URL_USER_LOGIN,
        dataType:'json',
        type:'POST',
        contentType:'application/json',
        data: loginJSON,
        success: function(data) {
            console.log("Success reached");
            Cookies.set('token', JSON.stringify(processToken(data.jwt)), { sameSite: 'strict' });
        }
    });
    window.location.href="./index.html"; 
}

function processToken(token) {
    return "Bearer ".concat(token);
}