"use strict";
exports.__esModule = true;
exports.assertNotEmptyOrNotify = exports.verifyOrCrash = void 0;
var uihelper_1 = require("./uihelper");
function verifyOrCrash(cond, msg) {
    if (msg === void 0) { msg = "Verify and crash called"; }
    if (!cond) {
        throw new Error(msg);
    }
}
exports.verifyOrCrash = verifyOrCrash;
function assertNotEmptyOrNotify(data) {
    if (data == null || data == undefined || data.length == 0) {
        uihelper_1.showNotification("You must pass some valid data");
        return false;
    }
    return true;
}
exports.assertNotEmptyOrNotify = assertNotEmptyOrNotify;
