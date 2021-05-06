"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.globalAppState = void 0;
var dlog_1 = require("../libs/dlog");
var types_1 = require("./types");
exports.globalAppState = types_1.initialState;
var AppStateReducer = function (state, action) {
    dlog_1.dlog.d("[AppStateReducer] updating app state for " + action.type);
    switch (action.type) {
        case "MERGE":
            exports.globalAppState = __assign(__assign({}, state), action.payload);
            break;
        default:
            exports.globalAppState = state;
    }
    return exports.globalAppState;
};
exports["default"] = AppStateReducer;
