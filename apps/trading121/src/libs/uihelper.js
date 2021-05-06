"use strict";
exports.__esModule = true;
exports.showNotification = void 0;
var react_native_simple_toast_1 = require("react-native-simple-toast");
function showNotification(msg) {
    react_native_simple_toast_1["default"].show(msg, react_native_simple_toast_1["default"].SHORT);
}
exports.showNotification = showNotification;
