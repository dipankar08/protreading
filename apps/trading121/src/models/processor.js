"use strict";
exports.__esModule = true;
exports.processor = void 0;
var dlog_1 = require("../libs/dlog");
var model_1 = require("./model");
var helper_1 = require("./helper");
var DataProcessor = /** @class */ (function () {
    function DataProcessor(message) {
        if (message === void 0) { message = "hello"; }
        this.summary = new Map(); // mainly show the summary
        this.stockMap = new Map();
        this.ltpMap = new Map();
        this.sectorList = new Map();
        this.recommendedList = new Map();
        this.position = { orderList: [], positionSummary: model_1.emptyPositionSummary, consolidatedList: [] };
    }
    // trying to process summary network resp.
    DataProcessor.prototype.setSummary = function (obj) {
        dlog_1.dlog.d("Process Summary Data ...");
        try {
            obj = obj.data;
            for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
                var c = _a[_i];
                var value = obj[c];
                this.summary.set(c, {
                    _id: c,
                    title: c.replace("_", " "),
                    count: value.length,
                    group: value,
                    avg_change: 0
                });
            }
            dlog_1.dlog.d("setSummary Success");
        }
        catch (e) {
            dlog_1.dlog.e("Exception while computing summary");
            dlog_1.dlog.ex(e);
        }
    };
    // Trying to process market info
    DataProcessor.prototype.setMarket = function (inp) {
        dlog_1.dlog.d("Processing Market data.....");
        try {
            var objList = obj.data;
            for (var _i = 0, _a = Object.keys(objList); _i < _a.length; _i++) {
                var c = _a[_i];
                objList[c].symbol = c;
                var stockdata = {
                    _id: c,
                    symbol: objList[c].symbol,
                    name: objList[c].name,
                    close: objList[c].close,
                    change: objList[c].close_change_percentage,
                    rsi: objList[c].rsi_14 || -1,
                    sector: objList[c].sector
                };
                this.stockMap.set(stockdata._id, stockdata);
            }
            dlog_1.dlog.d("set market success");
            this.recomputeGroup();
        }
        catch (err) {
            dlog_1.dlog.ex(err);
        }
    };
    // Trying to process Position
    DataProcessor.prototype.setPositionData = function (inp) {
        this.position = helper_1.processPositionData(inp, this.ltpMap);
    };
    DataProcessor.prototype.recomputeGroup = function () {
        var _this = this;
        // Process Entry.
        this.stockMap.forEach(function (value, key) {
            // 1. Find Recomendation
            _this.ltpMap.set(key, value.close);
            var rsi = value.rsi;
            if (rsi != -1 && rsi > 70) {
                value.recommended_to_sell =
                    "We recommended to sell this stock as this stock moved to overbought zone. It's expected that the people will start selling now.";
            }
            if (rsi != -1 && rsi < 30) {
                value.recommended_to_buy =
                    "We recommended to buy this stock as this stock moved to oversold zone. It's expected that the people will start buying now.";
            }
        });
        this.sectorList = helper_1.getSectorMap(Array.from(this.stockMap.values()));
        this.recommendedList = helper_1.getRecommendedMap(Array.from(this.stockMap.values()));
    };
    DataProcessor.prototype.setLatestIndicator = function (inp) {
        //todo
    };
    return DataProcessor;
}());
exports.processor = new DataProcessor("world");
