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
exports.useCoreApi = void 0;
var react_1 = require("react");
var dlog_1 = require("../libs/dlog");
var stoarge_1 = require("../libs/stoarge");
var CoreContext_1 = require("./CoreContext");
var Facebook = require("expo-facebook");
var Google = require("expo-google-app-auth");
exports.useCoreApi = function () {
    var coreState = react_1.useContext(CoreContext_1.CoreStateContext);
    var _a = react_1["default"].useState(false), loading = _a[0], setLoading = _a[1];
    var _b = react_1["default"].useState(""), error = _b[0], setError = _b[1];
    // find-out the right navigation
    function navigateNext(navigation) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                dlog_1.dlog.d("Navigation Next:" + JSON.stringify(CoreContext_1.globalCoreState));
                // Is show NUX.
                if (!CoreContext_1.globalCoreState.isNuxShown) {
                    navigateTo(navigation, "NuxScreen");
                    return [2 /*return*/];
                }
                // Do we have auth info
                if (!CoreContext_1.globalCoreState.authInfo) {
                    navigateTo(navigation, "SignInScreen");
                    return [2 /*return*/];
                }
                // Do we complate the silent login
                if (!CoreContext_1.globalCoreState.isSilentSignInComplete) {
                    navigateTo(navigation, "CompleteSignInScreen");
                    return [2 /*return*/];
                }
                return [2 /*return*/];
            });
        });
    }
    function navigateTo(navigation, target) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                navigation.push(target);
                return [2 /*return*/];
            });
        });
    }
    function doAppBoot(onSuccess) {
        return __awaiter(this, void 0, void 0, function () {
            var authData, _a, _b, err_1;
            var _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _e.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, stoarge_1.getData("AUTH_INFO", null)];
                    case 1:
                        authData = _e.sent();
                        _b = (_a = coreState).dispatch;
                        _c = {
                            type: "MERGE_STATE"
                        };
                        _d = {
                            isBootComplete: true
                        };
                        return [4 /*yield*/, isNuxShown()];
                    case 2:
                        _b.apply(_a, [(_c.payload = (_d.isNuxShown = _e.sent(),
                                _d.authInfo = authData,
                                _d.isUserLoggedIn = authData != null,
                                _d.isSilentSignInComplete = false,
                                _d.showHomeScreen = false,
                                _d),
                                _c)]);
                        onSuccess();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _e.sent();
                        dlog_1.dlog.ex(err_1);
                        setError("Not able to boot the app");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function isNuxShown() {
        return __awaiter(this, void 0, void 0, function () {
            var val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stoarge_1.getBool("NUX_SHOWN")];
                    case 1:
                        val = _a.sent();
                        return [2 /*return*/, val];
                }
            });
        });
    }
    function doMarkNuxShown(onSuccess) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, stoarge_1.setBool("NUX_SHOWN", true)];
                    case 1:
                        _a.sent();
                        onSuccess();
                        return [2 /*return*/];
                }
            });
        });
    }
    function saveAuthInfo(authInfo) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, coreState.dispatch({ type: "MERGE_STATE", payload: { authInfo: authInfo } })];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, stoarge_1.saveData("AUTH_INFO", authInfo)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        dlog_1.dlog.ex(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function doCompleteSignIn(onSuccess) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    // fetch info after sign-in.
                    // do some work..
                    coreState.dispatch({ type: "MERGE_STATE", payload: { isSilentSignInComplete: true } });
                    onSuccess();
                }
                catch (err) {
                    dlog_1.dlog.ex(err);
                    setError("Not able to fetch info after signIn");
                }
                return [2 /*return*/];
            });
        });
    }
    function doSignOut() {
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        //pass
                        // Delete saved data
                        return [4 /*yield*/, stoarge_1.deleteData("AUTH_INFO")];
                    case 1:
                        //pass
                        // Delete saved data
                        _a.sent();
                        return [4 /*yield*/, stoarge_1.deleteData("NUX_SHOWN")];
                    case 2:
                        _a.sent();
                        coreState.dispatch({
                            type: "MERGE_STATE",
                            payload: {
                                isBootComplete: true,
                                isNuxShown: false,
                                authInfo: null,
                                isUserLoggedIn: false,
                                isSilentSignInComplete: false,
                                showHomeScreen: false
                            }
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        dlog_1.dlog.ex(err_3);
                        setError("Not able to SignOut");
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function doSignUp() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                try {
                    //pass
                }
                catch (err) {
                    dlog_1.dlog.ex(err);
                    setError("Not able to SignUp");
                }
                return [2 /*return*/];
            });
        });
    }
    var FacebookSignIn = function (callback) { return __awaiter(void 0, void 0, void 0, function () {
        var _a, type, token, response, data, authInfo, _b, message;
        var _c, _d, _e, _f, _g, _h, _j;
        return __generator(this, function (_k) {
            switch (_k.label) {
                case 0:
                    (_c = callback.onBefore) === null || _c === void 0 ? void 0 : _c.call(callback);
                    _k.label = 1;
                case 1:
                    _k.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, Facebook.initializeAsync({
                            appId: "223411552837244"
                        })];
                case 2:
                    _k.sent();
                    return [4 /*yield*/, Facebook.logInWithReadPermissionsAsync({
                            permissions: ["public_profile", "email"]
                        })];
                case 3:
                    _a = _k.sent(), type = _a.type, token = _a.token;
                    if (!(type === "success")) return [3 /*break*/, 6];
                    // Get the user's name using Facebook's Graph API
                    console.log(token);
                    return [4 /*yield*/, fetch("https://graph.facebook.com/me?fields=id,name,email&access_token=" + token)];
                case 4:
                    response = _k.sent();
                    return [4 /*yield*/, response.json()];
                case 5:
                    data = _k.sent();
                    authInfo = {
                        user_id: data.email || data.id,
                        email: data.email || data.id,
                        profile_image: "",
                        name: data.name
                    };
                    saveAuthInfo(authInfo);
                    (_d = callback.onSuccess) === null || _d === void 0 ? void 0 : _d.call(callback, {});
                    (_e = callback.onComplete) === null || _e === void 0 ? void 0 : _e.call(callback);
                    return [3 /*break*/, 7];
                case 6:
                    // type === 'cancel'
                    (_f = callback.onError) === null || _f === void 0 ? void 0 : _f.call(callback, "User has canceled the login");
                    (_g = callback.onComplete) === null || _g === void 0 ? void 0 : _g.call(callback);
                    _k.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    _b = _k.sent();
                    message = _b.message;
                    alert("Facebook Login Error: " + message);
                    (_h = callback.onError) === null || _h === void 0 ? void 0 : _h.call(callback, "Not able to login");
                    (_j = callback.onComplete) === null || _j === void 0 ? void 0 : _j.call(callback);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var GoogleSignIn = function (callback) { return __awaiter(void 0, void 0, void 0, function () {
        var result, authInfo, e_1;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    console.log("Trying google signin");
                    (_a = callback.onBefore) === null || _a === void 0 ? void 0 : _a.call(callback);
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, Google.logInAsync({
                            androidClientId: "290736876800-h120tsplv4jdcf2676dogtjd26f2ftgd.apps.googleusercontent.com",
                            androidStandaloneAppClientId: "290736876800-h120tsplv4jdcf2676dogtjd26f2ftgd.apps.googleusercontent.com",
                            scopes: ["profile", "email"]
                        })];
                case 2:
                    result = _h.sent();
                    console.log(result);
                    if (result.type === "success" && result.user.email) {
                        authInfo = {
                            user_id: result.user.email,
                            name: result.user.name || "Unknown Google User",
                            email: result.user.email,
                            profile_image: result.user.photoUrl
                        };
                        saveAuthInfo(authInfo);
                        (_b = callback.onSuccess) === null || _b === void 0 ? void 0 : _b.call(callback, result);
                        (_c = callback.onComplete) === null || _c === void 0 ? void 0 : _c.call(callback);
                    }
                    else {
                        (_d = callback.onError) === null || _d === void 0 ? void 0 : _d.call(callback, "User canceled");
                        (_e = callback.onComplete) === null || _e === void 0 ? void 0 : _e.call(callback);
                        console.log("cancelled");
                    }
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _h.sent();
                    (_f = callback.onError) === null || _f === void 0 ? void 0 : _f.call(callback, "Not able to signin");
                    (_g = callback.onComplete) === null || _g === void 0 ? void 0 : _g.call(callback);
                    console.log("error", e_1);
                    console.log(e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loginAsGuest = function (user_id, callback) {
        var _a, _b;
        var authInfo = {
            user_id: user_id,
            name: "Guest User",
            email: "test@test.com",
            profile_image: ""
        };
        saveAuthInfo(authInfo);
        (_a = callback.onSuccess) === null || _a === void 0 ? void 0 : _a.call(callback, authInfo);
        (_b = callback.onComplete) === null || _b === void 0 ? void 0 : _b.call(callback);
    };
    return {
        loading: loading,
        error: error,
        doAppBoot: doAppBoot,
        isNuxShown: isNuxShown,
        doMarkNuxShown: doMarkNuxShown,
        doCompleteSignIn: doCompleteSignIn,
        doSignOut: doSignOut,
        doSignUp: doSignUp,
        navigateNext: navigateNext,
        GoogleSignIn: GoogleSignIn,
        navigateTo: navigateTo,
        FacebookSignIn: FacebookSignIn,
        loginAsGuest: loginAsGuest
    };
};
