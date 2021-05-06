"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.postRequest = exports.getRequest = exports.loadLatestData = void 0;
var axios_1 = require("axios");
var CONST_1 = require("../appstate/CONST");
var dlog_1 = require("./dlog");
var stoarge_1 = require("./stoarge");
function loadLatestData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, jsondata, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1["default"].get(CONST_1.PRO_TRADING_SERVER + "/latest?candle_type=5m")];
                case 1:
                    response = _a.sent();
                    jsondata = response.data;
                    if (jsondata.status == "success") {
                        data = jsondata.out.data;
                        if (Object.keys.length == 0) {
                            throw new Error("Empty data");
                        }
                        return [2 /*return*/, data];
                    }
                    else {
                        throw new Error("Server sends error:" + response.data);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadLatestData = loadLatestData;
// Defau;lt use cacche
function getRequest(url, cacheKey, cache_first) {
    if (cache_first === void 0) { cache_first = true; }
    return __awaiter(this, void 0, void 0, function () {
        var data, response, jsondata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dlog_1.dlog.d("try fetching " + url);
                    if (!(cache_first && cacheKey)) return [3 /*break*/, 2];
                    dlog_1.dlog.d("[Network]Trying cache first..");
                    return [4 /*yield*/, stoarge_1.getData(cacheKey)];
                case 1:
                    data = _a.sent();
                    if (data) {
                        return [2 /*return*/, data];
                    }
                    _a.label = 2;
                case 2: return [4 /*yield*/, axios_1["default"].get(url)];
                case 3:
                    response = _a.sent();
                    jsondata = response.data;
                    if (!(jsondata.status == "success")) return [3 /*break*/, 6];
                    dlog_1.dlog.d("fetch success...");
                    if (!cacheKey) return [3 /*break*/, 5];
                    return [4 /*yield*/, stoarge_1.saveData(cacheKey, jsondata.out)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, jsondata.out];
                case 6:
                    dlog_1.dlog.d("get failed. URL: " + url + ".." + JSON.stringify(response.data));
                    throw new Error("Server sends error");
            }
        });
    });
}
exports.getRequest = getRequest;
// No try catch here
function postRequest(url, data) {
    return __awaiter(this, void 0, void 0, function () {
        var response, jsondata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dlog_1.dlog.d("[Network] posting url:" + url + ", data: " + JSON.stringify(data));
                    return [4 /*yield*/, axios_1["default"].post(url, data)];
                case 1:
                    response = _a.sent();
                    jsondata = response.data;
                    if (jsondata.status == "success") {
                        dlog_1.dlog.d("post success...");
                        return [2 /*return*/, jsondata.out];
                    }
                    else {
                        dlog_1.dlog.d("post failed for URL:" + url);
                        throw new Error("Server sends error");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.postRequest = postRequest;
