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
exports.useNetwork = void 0;
var react_1 = require("react");
var react_2 = require("react");
var react_native_1 = require("react-native");
var AppStateStore_1 = require("../appstate/AppStateStore");
var CONST_1 = require("../appstate/CONST");
var assert_1 = require("../libs/assert");
var dlog_1 = require("../libs/dlog");
var network_1 = require("../libs/network");
var uihelper_1 = require("../libs/uihelper");
var processor_1 = require("../models/processor");
var time_1 = require("../libs/time");
var CoreContext_1 = require("../core/CoreContext");
var AppStateReducer_1 = require("../appstate/AppStateReducer");
var SUMMARY_URL = CONST_1.PRO_TRADING_SERVER + "/summary";
var LATEST_URL = CONST_1.PRO_TRADING_SERVER + "/latest?candle_type=5m";
var MARKET_URL = CONST_1.PRO_TRADING_SERVER + "/market";
exports.useNetwork = function () {
    var appState = react_2.useContext(AppStateStore_1.AppStateContext);
    var coreState = react_2.useContext(CoreContext_1.CoreStateContext);
    var _a = react_1["default"].useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1["default"].useState(""), error = _b[0], setError = _b[1];
    function doAllNetworkCallOnBoot(callback) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        (_a = callback.onBefore) === null || _a === void 0 ? void 0 : _a.call(callback);
                        return [4 /*yield*/, reLoadAllData()];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, fetchUserInfo(callback)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    // realod all market Data
    function reLoadAllData(callback) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function () {
            var summary, latest, market, e_1;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        dlog_1.dlog.d("[NETWORK] fetching from network ");
                        (_a = callback === null || callback === void 0 ? void 0 : callback.onBefore) === null || _a === void 0 ? void 0 : _a.call(callback);
                        _f.label = 1;
                    case 1:
                        _f.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, network_1.getRequest(SUMMARY_URL, CONST_1.CACHE_KEY_SUMMARY, false)];
                    case 2:
                        summary = _f.sent();
                        return [4 /*yield*/, network_1.getRequest(LATEST_URL, CONST_1.CACHE_KEY_MARKET, false)];
                    case 3:
                        latest = _f.sent();
                        return [4 /*yield*/, network_1.getRequest(MARKET_URL, CONST_1.CACHE_KEY_MARKET, false)];
                    case 4:
                        market = _f.sent();
                        // process alll data
                        processor_1.processor.setSummary(summary);
                        processor_1.processor.setMarket(market);
                        processor_1.processor.setLatestIndicator(latest);
                        appState.dispatch({
                            type: "MERGE",
                            payload: {
                                summary: processor_1.processor.summary,
                                sectorList: processor_1.processor.sectorList,
                                recommendedList: processor_1.processor.recommendedList
                            }
                        });
                        dlog_1.dlog.d("[NETWORK] fetching from network complete ");
                        (_b = callback === null || callback === void 0 ? void 0 : callback.onSuccess) === null || _b === void 0 ? void 0 : _b.call(callback, {});
                        (_c = callback === null || callback === void 0 ? void 0 : callback.onComplete) === null || _c === void 0 ? void 0 : _c.call(callback);
                        return [3 /*break*/, 6];
                    case 5:
                        e_1 = _f.sent();
                        dlog_1.dlog.d("[NETWORK] fetching from network failed " + SUMMARY_URL + " - " + LATEST_URL);
                        dlog_1.dlog.ex(e_1);
                        (_d = callback === null || callback === void 0 ? void 0 : callback.onError) === null || _d === void 0 ? void 0 : _d.call(callback, "Not able to ralod data");
                        (_e = callback === null || callback === void 0 ? void 0 : callback.onComplete) === null || _e === void 0 ? void 0 : _e.call(callback);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    }
    // fetch the User info like position
    function fetchUserInfo(callback) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function () {
            var network_resp, e_2;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        if (coreState.state.authInfo == null) {
                            dlog_1.dlog.d("early return");
                            return [2 /*return*/];
                        }
                        (_a = callback === null || callback === void 0 ? void 0 : callback.onBefore) === null || _a === void 0 ? void 0 : _a.call(callback);
                        _g.label = 1;
                    case 1:
                        _g.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, network_1.getRequest(CONST_1.SIMPLESTORE_ENDPOINT + "/api/grodok_position?user_id=" + ((_b = coreState.state.authInfo) === null || _b === void 0 ? void 0 : _b.user_id) + "&_limit=100", CONST_1.CACHE_KEY_POSITION, false)];
                    case 2:
                        network_resp = _g.sent();
                        assert_1.verifyOrCrash(AppStateReducer_1.globalAppState.ltpMap != null, "Market is null");
                        processor_1.processor.setPositionData(network_resp);
                        appState.dispatch({ type: "MERGE", payload: { position: processor_1.processor.position } });
                        setLoading(false);
                        (_c = callback === null || callback === void 0 ? void 0 : callback.onSuccess) === null || _c === void 0 ? void 0 : _c.call(callback, {});
                        (_d = callback === null || callback === void 0 ? void 0 : callback.onComplete) === null || _d === void 0 ? void 0 : _d.call(callback);
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _g.sent();
                        dlog_1.dlog.ex(e_2);
                        setLoading(false);
                        setError("Not able to get Data");
                        (_e = callback === null || callback === void 0 ? void 0 : callback.onError) === null || _e === void 0 ? void 0 : _e.call(callback, "Not able to get data");
                        (_f = callback === null || callback === void 0 ? void 0 : callback.onComplete) === null || _f === void 0 ? void 0 : _f.call(callback);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function createOrder(stock, price, quantities, onSuccess, onError) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(assert_1.assertNotEmptyOrNotify(stock) && assert_1.assertNotEmptyOrNotify(price) && assert_1.assertNotEmptyOrNotify(quantities))) {
                            onError === null || onError === void 0 ? void 0 : onError();
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, network_1.postRequest(CONST_1.SIMPLESTORE_ENDPOINT + "/api/grodok_position/create", {
                                user_id: (_a = coreState.state.authInfo) === null || _a === void 0 ? void 0 : _a.user_id,
                                symbol: stock,
                                buy_price: parseFloat(price),
                                quantities: parseFloat(quantities),
                                buy_ts: time_1.getCurrentDate()
                            })];
                    case 2:
                        response = _b.sent();
                        return [4 /*yield*/, fetchUserInfo()];
                    case 3:
                        _b.sent();
                        uihelper_1.showNotification("Created a new order");
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _b.sent();
                        dlog_1.dlog.ex(err_1);
                        uihelper_1.showNotification("Not able to create a order");
                        onError === null || onError === void 0 ? void 0 : onError();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function closeOrder(id, price, onSuccess, onError) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(assert_1.assertNotEmptyOrNotify(id) && assert_1.assertNotEmptyOrNotify(price))) {
                            onError === null || onError === void 0 ? void 0 : onError();
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, network_1.postRequest(CONST_1.SIMPLESTORE_ENDPOINT + "/api/grodok_position/update", {
                                _id: id,
                                sell_price: parseFloat(price),
                                is_sold: true,
                                sell_ts: time_1.getCurrentDate()
                            })];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, fetchUserInfo()];
                    case 3:
                        _a.sent();
                        uihelper_1.showNotification("Order is closed");
                        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess();
                        return [3 /*break*/, 5];
                    case 4:
                        err_2 = _a.sent();
                        dlog_1.dlog.d(err_2);
                        uihelper_1.showNotification("Not able to close this order");
                        onError === null || onError === void 0 ? void 0 : onError();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function forceUpdateData(onSuccess, onError) {
        return __awaiter(this, void 0, void 0, function () {
            var task1, task2, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dlog_1.dlog.d("[NETWORK] forceUpdateData");
                        setLoading(true);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, network_1.getRequest(CONST_1.PRO_TRADING_SERVER + "/snapshot?candle_type=1d&force=1", null, false)];
                    case 2:
                        task1 = _a.sent();
                        return [4 /*yield*/, network_1.getRequest(CONST_1.PRO_TRADING_SERVER + "//snapshot?candle_type=5m&force=1", null, false)];
                    case 3:
                        task2 = _a.sent();
                        setLoading(false);
                        dlog_1.dlog.d("[NETWORK] forceUpdateData complete task1:" + JSON.stringify(task1) + "  task2:" + JSON.stringify(task2) + " ");
                        uihelper_1.showNotification("task submitted");
                        if (onSuccess) {
                            onSuccess();
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        e_3 = _a.sent();
                        //setError("Not able to get Data");
                        setLoading(false);
                        uihelper_1.showNotification("Not able to submit task");
                        dlog_1.dlog.d("[NETWORK] forceUpdateData failed ");
                        dlog_1.dlog.ex(e_3);
                        if (onError) {
                            onError();
                        }
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    function reopenOrder(id) {
        return __awaiter(this, void 0, void 0, function () {
            function reopen(id) {
                return __awaiter(this, void 0, void 0, function () {
                    var response;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, network_1.postRequest(CONST_1.SIMPLESTORE_ENDPOINT + "/api/grodok_position/update", {
                                    _id: id,
                                    sell_price: 0,
                                    is_sold: true
                                })];
                            case 1:
                                response = _a.sent();
                                return [4 /*yield*/, fetchUserInfo()];
                            case 2:
                                _a.sent();
                                uihelper_1.showNotification("Order is closed");
                                return [2 /*return*/];
                        }
                    });
                });
            }
            return __generator(this, function (_a) {
                react_native_1.Alert.alert("Re-Open Order?", "Do you want to reopen this order?", [
                    {
                        text: "Cancel",
                        onPress: function () { return console.log("Cancel Pressed"); },
                        style: "cancel"
                    },
                    {
                        text: "OK",
                        onPress: function () {
                            console.log("OK Pressed");
                            reopen(id);
                        }
                    },
                ]);
                return [2 /*return*/];
            });
        });
    }
    return { loading: loading, error: error, reLoadAllData: reLoadAllData, fetchUserInfo: fetchUserInfo, createOrder: createOrder, closeOrder: closeOrder, forceUpdateData: forceUpdateData, reopenOrder: reopenOrder, doAllNetworkCallOnBoot: doAllNetworkCallOnBoot };
};
