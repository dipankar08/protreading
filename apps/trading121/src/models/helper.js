"use strict";
exports.__esModule = true;
exports.processPositionData = exports.getSectorMap = exports.getRecommendedMap = exports.updateTGroupMarketEntry = void 0;
var dlog_1 = require("../libs/dlog");
var time_1 = require("../libs/time");
var model_1 = require("./model");
var taxcalculator_1 = require("./taxcalculator");
// compute count and avg.
function updateTGroupMarketEntry(map) {
    map.forEach(function (value) {
        value.count = value.group.length;
    });
    map.forEach(function (value, key) {
        value.avg_change = value.group.reduce(function (a, b) { return a + b.change; }, 0) / value.group.length;
        value.group = value.group.sort(function (a, b) {
            return b.change - a.change;
        });
    });
}
exports.updateTGroupMarketEntry = updateTGroupMarketEntry;
// This function will group the recommendation
function getRecommendedMap(stocks) {
    var _a, _b, _c, _d;
    var recommendedMap = new Map();
    recommendedMap.set(model_1.RecommendedType.DELIVERY_BUY.toString(), {
        _id: model_1.RecommendedType.DELIVERY_BUY.toString(),
        title: model_1.RecommendedType.DELIVERY_BUY.toString(),
        group: [],
        count: 0,
        avg_change: 0
    });
    recommendedMap.set(model_1.RecommendedType.DELIVERY_SELL.toString(), {
        _id: model_1.RecommendedType.DELIVERY_SELL.toString(),
        title: model_1.RecommendedType.DELIVERY_SELL.toString(),
        group: [],
        count: 0,
        avg_change: 0
    });
    recommendedMap.set(model_1.RecommendedType.INTRADAY_BUY.toString(), {
        _id: model_1.RecommendedType.INTRADAY_BUY.toString(),
        title: model_1.RecommendedType.INTRADAY_BUY.toString(),
        group: [],
        count: 0,
        avg_change: 0
    });
    recommendedMap.set(model_1.RecommendedType.INTRADAY_SELL.toString(), {
        _id: model_1.RecommendedType.INTRADAY_SELL.toString(),
        title: model_1.RecommendedType.INTRADAY_SELL.toString(),
        group: [],
        count: 0,
        avg_change: 0
    });
    for (var _i = 0, stocks_1 = stocks; _i < stocks_1.length; _i++) {
        var stock = stocks_1[_i];
        if (stock.rsi != -1 && stock.rsi > 70) {
            (_a = recommendedMap.get(model_1.RecommendedType.DELIVERY_SELL.toString())) === null || _a === void 0 ? void 0 : _a.group.push(stock);
            (_b = recommendedMap.get(model_1.RecommendedType.INTRADAY_SELL.toString())) === null || _b === void 0 ? void 0 : _b.group.push(stock);
        }
        if (stock.rsi != -1 && stock.rsi < 30) {
            (_c = recommendedMap.get(model_1.RecommendedType.INTRADAY_BUY.toString())) === null || _c === void 0 ? void 0 : _c.group.push(stock);
            (_d = recommendedMap.get(model_1.RecommendedType.DELIVERY_BUY.toString())) === null || _d === void 0 ? void 0 : _d.group.push(stock);
        }
    }
    // summary
    updateTGroupMarketEntry(recommendedMap);
    return recommendedMap;
}
exports.getRecommendedMap = getRecommendedMap;
// This function will group the recommendation
function getSectorMap(stocks) {
    var sectorMap = new Map();
    sectorMap.set("all_stocks", {
        title: "All Stock",
        _id: "all_stock",
        group: [],
        count: 0,
        avg_change: 0
    });
    for (var _i = 0, stocks_2 = stocks; _i < stocks_2.length; _i++) {
        var stock = stocks_2[_i];
        if (stock.sector) {
            var sector = stock.sector[0];
            if (!sectorMap.has(sector)) {
                sectorMap.set(sector, {
                    title: sector,
                    _id: sector,
                    group: [],
                    count: 0,
                    avg_change: 0
                });
            }
            sectorMap.get(sector).group.push(stock);
            sectorMap.get("all_stocks").group.push(stock);
        }
        else {
            dlog_1.dlog.d("No sector found...");
        }
    }
    updateTGroupMarketEntry(sectorMap);
    return sectorMap;
}
exports.getSectorMap = getSectorMap;
function processPositionData(obj, ltpMap) {
    var _a;
    //dlog.obj(obj)
    var orderList = new Array();
    var consolidatedList = new Array();
    var consolidatedMap = new Map();
    var index = 0;
    for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
        var x = obj_1[_i];
        //dlog.d(">>> COMPUTERD");
        var symbol = x.symbol;
        var ltp = ltpMap.get(symbol.toUpperCase());
        //dlog.d(x);
        if (!ltp) {
            continue;
        }
        x.ltp = ltp; //x.latest;
        //dlog.d(latest);
        x.open_for = time_1.getAgoString(x.buy_ts);
        //dlog.d(x.sell_price == 0);
        x.invested_amount = x.buy_price * x.quantities;
        x.current_amount = x.ltp * x.quantities;
        x.change = x.current_amount - x.invested_amount;
        x.change_per = ((x.ltp - x.buy_price) * 100) / x.buy_price;
        x.gross = (x.ltp - x.buy_price) * x.quantities;
        var is_open = x.sell_price == undefined || x.sell_price == null || x.sell_price == 0;
        var closed_sum = is_open ? 0 : x.sell_price * x.quantities;
        var tax_info = undefined;
        var total_tax_1 = 0;
        if (time_1.isSameDay(x.buy_ts, x.sell_ts)) {
            tax_info = taxcalculator_1.cal_intraday_tax(x.buy_price, x.sell_price || ltp, x.quantities);
            total_tax_1 = tax_info.total_tax;
        }
        else {
            tax_info = taxcalculator_1.cal_delivery_tax(x.buy_price, x.sell_price || ltp, x.quantities);
            total_tax_1 = tax_info.total_tax;
        }
        var cur_result = {
            _id: x._id,
            index: index++,
            symbol: x.symbol,
            buy_price: x.buy_price,
            sell_price: x.sell_price || null,
            ltp: ltp,
            ltp_change: 0,
            buy_ts: x.buy_ts,
            sell_ts: x.sell_ts || null,
            quantities: x.quantities,
            is_open: is_open,
            is_gain: x.buy_price > x.ltp,
            open_for: x.open_for,
            invested_sum: x.invested_amount,
            current_sum: x.current_amount,
            closed_sum: closed_sum,
            change: x.change,
            change_per: x.change_per,
            gross: x.gross,
            isBreakOrder: true,
            orderList: [],
            taxInfo: tax_info,
            total_tax: total_tax_1
        };
        // dlog.d(cur_result);
        orderList.push(cur_result);
        // update in map.
        if (!consolidatedMap.has(cur_result.symbol)) {
            consolidatedMap.set(cur_result.symbol, new Array());
        }
        (_a = consolidatedMap.get(cur_result.symbol)) === null || _a === void 0 ? void 0 : _a.push(cur_result);
    }
    // compute the consolidatedList
    var i = 1;
    for (var _b = 0, consolidatedMap_1 = consolidatedMap; _b < consolidatedMap_1.length; _b++) {
        var _c = consolidatedMap_1[_b], symbol = _c[0], value = _c[1];
        var total_stock = 0;
        var total_invested = 0;
        var total_tax_2 = 0;
        for (var _d = 0, value_1 = value; _d < value_1.length; _d++) {
            var x = value_1[_d];
            if (!x.is_open) {
                continue;
            }
            total_stock += x.quantities;
            total_invested += x.quantities * x.buy_price;
            total_tax_2 += x.total_tax;
        }
        var ltp = ltpMap.get(symbol.toUpperCase());
        if (!ltp) {
            dlog_1.dlog.e("Not found LTP for stock:");
            continue;
        }
        if (total_stock == 0) {
            continue;
        }
        consolidatedList.push({
            index: i++,
            _id: symbol,
            symbol: symbol,
            ltp: ltp,
            ltp_change: 0,
            quantities: total_stock,
            buy_price: total_invested / total_stock,
            invested_sum: total_invested,
            current_sum: ltp * total_stock,
            change: ltp * total_stock - total_invested,
            change_per: ((ltp * total_stock - total_invested) / total_invested) * 100,
            orderList: value,
            buy_ts: "",
            sell_ts: "",
            is_open: true,
            is_gain: ltp * total_stock - total_invested > 0,
            sell_price: 0,
            open_for: "4 days",
            gross: 0,
            isBreakOrder: false,
            closed_sum: 0,
            total_tax: total_tax_2
        });
    }
    // compute position summary
    var positionSummary1 = {
        invested_amount: 0,
        current_amount: 0,
        open_order_count: 0,
        committed_change: 0,
        committed_pl: 0,
        total_change: 0,
        total_pl: 0,
        uncommitted_change: 0,
        uncommitted_pl: 0,
        total_tax: 0,
        net_profit: 0
    };
    var closed_order_invested_sum = 0;
    var closed_order_closed_sum = 0;
    var total_tax = 0;
    for (var _e = 0, orderList_1 = orderList; _e < orderList_1.length; _e++) {
        var order = orderList_1[_e];
        if (order.is_open) {
            positionSummary1.open_order_count++;
            positionSummary1.invested_amount += order.invested_sum;
            positionSummary1.current_amount += order.current_sum;
        }
        else {
            closed_order_invested_sum += order.invested_sum;
            closed_order_closed_sum += order.closed_sum;
            total_tax += order.total_tax;
        }
    }
    positionSummary1.total_tax = total_tax;
    positionSummary1.net_profit = closed_order_closed_sum - closed_order_invested_sum - total_tax;
    positionSummary1.committed_pl = closed_order_closed_sum - closed_order_invested_sum;
    if (closed_order_invested_sum != 0) {
        positionSummary1.committed_change = ((closed_order_closed_sum - closed_order_invested_sum) / closed_order_invested_sum) * 100;
    }
    positionSummary1.uncommitted_pl = positionSummary1.current_amount - positionSummary1.invested_amount;
    if (positionSummary1.invested_amount != 0) {
        positionSummary1.uncommitted_change =
            ((positionSummary1.current_amount - positionSummary1.invested_amount) / positionSummary1.invested_amount) * 100;
    }
    positionSummary1.total_pl = positionSummary1.committed_pl + positionSummary1.uncommitted_pl;
    positionSummary1.total_change = positionSummary1.committed_change + positionSummary1.uncommitted_change;
    // sort order list based on the open order first.
    orderList.sort(function (a, b) {
        return a.is_open ? -1 : 1;
    });
    var position = {
        orderList: orderList,
        positionSummary: positionSummary1,
        consolidatedList: consolidatedList
    };
    //dlog.obj(position)
    return position;
}
exports.processPositionData = processPositionData;
