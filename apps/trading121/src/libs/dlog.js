"use strict";
exports.__esModule = true;
exports.dlog = void 0;
var dlog;
(function (dlog) {
    function d(msg) {
        console.log("\n[DEBUG]" + (msg || "null"));
    }
    dlog.d = d;
    function e(msg) {
        console.log("[ERROR]" + (msg || "null"));
    }
    dlog.e = e;
    function obj(obj, msg) {
        if (msg === void 0) { msg = "DEBUG OBJECT"; }
        console.log("=========================== " + msg + " START ======================");
        console.log(JSON.stringify(obj || {}, null, 1));
        console.log("=========================== " + msg + " END ======================");
    }
    dlog.obj = obj;
    function map(map) {
        console.log("=========================== DEBUG OBJECT  START ======================");
        for (var _i = 0, _a = map.keys(); _i < _a.length; _i++) {
            var x = _a[_i];
            console.log(JSON.stringify(x) + " ==> " + JSON.stringify(map.get(x)));
        }
        console.log("=========================== DEBUG OBJECT END ======================");
    }
    dlog.map = map;
    function ex(e) {
        console.log("[ERROR]" + e.message);
        console.log(e.stack);
    }
    dlog.ex = ex;
})(dlog = exports.dlog || (exports.dlog = {}));
