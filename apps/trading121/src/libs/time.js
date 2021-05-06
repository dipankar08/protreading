"use strict";
exports.__esModule = true;
exports.isSameDay = exports.getFormattedDate = exports.getAgoString = exports.getDataFromString = exports.getCurrentDate = void 0;
//import en from "javascript-time-ago/locale/en";
//TimeAgo.addDefaultLocale(en);
// Create formatter (English).
//const timeAgo = new TimeAgo();
function getCurrentDate() {
    return new Date().toISOString();
}
exports.getCurrentDate = getCurrentDate;
function getDataFromString(str) {
    new Date(str);
}
exports.getDataFromString = getDataFromString;
function getAgoString(str) {
    try {
        //return timeAgo.format(new Date(str));
    }
    catch (ee) {
        return "sometime";
    }
}
exports.getAgoString = getAgoString;
function getFormattedDate(str) {
    var d = new Date(str);
    return d.toLocaleString();
}
exports.getFormattedDate = getFormattedDate;
function isSameDay(day1, day2) {
    // todo
    return false;
}
exports.isSameDay = isSameDay;
