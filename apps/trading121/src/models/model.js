"use strict";
exports.__esModule = true;
exports.emptyPositionSummary = exports.RecommendedType = void 0;
var RecommendedType;
(function (RecommendedType) {
    RecommendedType["INTRADAY_BUY"] = "IntraDay Buy";
    RecommendedType["INTRADAY_SELL"] = "IntraDay Sell";
    RecommendedType["DELIVERY_BUY"] = "Delivery Buy";
    RecommendedType["DELIVERY_SELL"] = "Delivery Sell";
})(RecommendedType = exports.RecommendedType || (exports.RecommendedType = {}));
exports.emptyPositionSummary = {
    invested_amount: 0,
    current_amount: 0,
    total_change: 0,
    total_pl: 0,
    total_tax: 0,
    committed_change: 0,
    committed_pl: 0,
    net_profit: 0,
    open_order_count: 0,
    uncommitted_change: 0,
    uncommitted_pl: 0
};
