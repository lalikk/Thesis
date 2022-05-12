import Cookies from '../node_modules/js-cookie/dist/js.cookie.mjs'
import { URL_USER_AUTH_CHECK } from './constants.js'

export async function CHECK_VALID_LOGIN() {
    let isValid = false;
    let tokenCookie = Cookies.get('token');
    if (typeof tokenCookie == 'undefined') {
        console.log("Undefined token");
        return false
    }
    tokenCookie = JSON.parse(tokenCookie);
    let tokenStr = tokenCookie.substring(7);
    let tokenJson = {};
    tokenJson.token = tokenStr;
    tokenJson = JSON.stringify(tokenJson);
    await $.ajax({
        url:URL_USER_AUTH_CHECK,
        dataType:'json',
        type:'POST',
        contentType:'application/json',
        data: tokenJson,
        success: function(data) {
            isValid = data.validAuthentication;
        }
    });
    return isValid;
          //TODO error log?? and handling???
}

export function RETRIEVE_TOKEN() {
    let tokenCookie = Cookies.get('token');
    if (typeof tokenCookie == 'undefined') {
        console.log("Undefined token");
        return null;
    }
    tokenCookie = JSON.parse(tokenCookie);
    return tokenCookie;
}
