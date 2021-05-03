// convert network json data to right data format.
import { Value } from "react-native-reanimated";
import { dlog } from "../libs/dlog";
import { RecommendedType, TGroupMarketEntry, TKeyText, TMarket, TMarketEntry, TObject, TOrder, TPosition, TPositionSummary, TSummary } from "./model";
import { getAgoString } from "../libs/time";
import { isSameDay } from "../libs/time";
import { cal_delivery_tax, cal_intraday_tax } from "./taxcalculator";

// compute count and avg.
function updateTGroupMarketEntry(map: Map<string, TGroupMarketEntry>) {
  map.forEach((value) => {
    value.count = value.group.length;
  });
  map.forEach(function (value, key) {
    value.avg_change = value.group.reduce((a, b) => a + b.change, 0) / value.group.length;
    value.group = value.group.sort(function (a, b) {
      return b.change - a.change;
    });
  });
}

// This function will group the recommendation
function getRecommendedMap(stocks: Array<TMarketEntry>): Map<string, TGroupMarketEntry> {
  let recommendedMap: Map<string, TGroupMarketEntry> = new Map();
  recommendedMap.set(RecommendedType.DELIVERY_BUY.toString(), {
    _id: RecommendedType.DELIVERY_BUY.toString(),
    title: RecommendedType.DELIVERY_BUY.toString(),
    group: [],
    count: 0,
    avg_change: 0,
  });
  recommendedMap.set(RecommendedType.DELIVERY_SELL.toString(), {
    _id: RecommendedType.DELIVERY_SELL.toString(),
    title: RecommendedType.DELIVERY_SELL.toString(),
    group: [],
    count: 0,
    avg_change: 0,
  });
  recommendedMap.set(RecommendedType.INTRADAY_BUY.toString(), {
    _id: RecommendedType.INTRADAY_BUY.toString(),
    title: RecommendedType.INTRADAY_BUY.toString(),
    group: [],
    count: 0,
    avg_change: 0,
  });
  recommendedMap.set(RecommendedType.INTRADAY_SELL.toString(), {
    _id: RecommendedType.INTRADAY_SELL.toString(),
    title: RecommendedType.INTRADAY_SELL.toString(),
    group: [],
    count: 0,
    avg_change: 0,
  });

  for (var stock of stocks) {
    if (stock.rsi != -1 && stock.rsi > 70) {
      recommendedMap.get(RecommendedType.DELIVERY_SELL.toString())?.group.push(stock);
      recommendedMap.get(RecommendedType.INTRADAY_SELL.toString())?.group.push(stock);
    }
    if (stock.rsi != -1 && stock.rsi < 30) {
      recommendedMap.get(RecommendedType.INTRADAY_BUY.toString())?.group.push(stock);
      recommendedMap.get(RecommendedType.DELIVERY_BUY.toString())?.group.push(stock);
    }
  }
  // summary
  updateTGroupMarketEntry(recommendedMap);
  return recommendedMap;
}

// This function will group the recommendation
function getSectorMap(stocks: Array<TMarketEntry>): Map<string, TGroupMarketEntry> {
  let sectorMap: Map<string, TGroupMarketEntry> = new Map();
  sectorMap.set("all_stocks", {
    title: "All Stock",
    _id: "all_stock",
    group: [],
    count: 0,
    avg_change: 0,
  });
  for (var stock of stocks) {
    if (stock.sector) {
      let sector = stock.sector[0];
      if (!sectorMap.has(sector)) {
        sectorMap.set(sector, {
          title: sector,
          _id: sector,
          group: [],
          count: 0,
          avg_change: 0,
        });
      }
      sectorMap.get(sector)!.group.push(stock);
      sectorMap.get("all_stocks")!.group.push(stock);
    } else {
      dlog.d("No sector found...");
    }
  }
  updateTGroupMarketEntry(sectorMap);
  return sectorMap;
}

export function processMarketData(obj: any): TMarket {
  //dlog.d(obj);
  dlog.d("Processing Market data.....");
  obj = obj.data;
  let stocks: Array<TMarketEntry> = [];
  let ltpMap: Map<string, number> = new Map();

  for (let c of Object.keys(obj)) {
    ltpMap.set(c, obj[c].close);
    obj[c].symbol = c;
    const stockdata: TMarketEntry = {
      _id: c,
      symbol: obj[c].symbol,
      name: obj[c].name,
      close: obj[c].close,
      change: obj[c].close_change_percentage,
      rsi: obj[c].rsi_14,
      sector: obj[c].sector,
    };
    const rsi = obj[c].rsi_14;
    if (rsi != -1 && rsi > 70) {
      stockdata.recommended_to_sell =
        "We recommended to sell this stock as this stock moved to overbought zone. It's expected that the people will start selling now.";
    }
    if (rsi != -1 && rsi < 30) {
      stockdata.recommended_to_buy =
        "We recommended to buy this stock as this stock moved to oversold zone. It's expected that the people will start buying now.";
    }
    stocks.push(stockdata);
    // calculate sector
  }

  //dlog.obj(stocks);

  // update stock List.

  let market: TMarket = {
    stocks: stocks,
    ltpMap: ltpMap,
    sectorList: getSectorMap(stocks),
    recommendedList: getRecommendedMap(stocks),
  };
  //dlog.map(market.sectorList)
  return market;
}

export function processSummaryData(obj: any): TSummary {
  dlog.d("Process Summary Data ...");
  let result: Map<string, TGroupMarketEntry> = new Map();
  try {
    obj = obj.data;
    for (let c of Object.keys(obj)) {
      let value = obj[c] as TMarketEntry[];
      result.set(c, {
        _id: c,
        title: c.replace("_", " "),
        count: value.length,
        group: value,
        avg_change: 0,
      });
      dlog.d("added...");
    }
    dlog.d("Compltee summary calculation");
  } catch (e) {
    dlog.e("Error hapens hwile processing summary data");
    dlog.ex(e);
  }
  //dlog.map(result)
  let summary: TSummary = {
    data: result,
  };
  return summary;
}

export function annotateRecommendation(obj: TObject) {
  obj.recomendation;
}

export function processPositionData(obj: any, curMarket: TMarket): TPosition {
  //dlog.obj(obj)
  let orderList = new Array<TOrder>();

  let consolidatedList = new Array<TOrder>();
  let consolidatedMap: Map<string, Array<TOrder>> = new Map();
  let index = 0;
  for (var x of obj) {
    //dlog.d(">>> COMPUTERD");
    let symbol: string = x.symbol;
    let ltp = curMarket.ltpMap.get(symbol.toUpperCase());
    //dlog.d(x);
    if (!ltp) {
      continue;
    }
    x.ltp = ltp; //x.latest;
    //dlog.d(latest);
    x.open_for = getAgoString(x.buy_ts);
    //dlog.d(x.sell_price == 0);
    x.invested_amount = x.buy_price * x.quantities;
    x.current_amount = x.ltp * x.quantities;
    x.change = x.current_amount - x.invested_amount;
    x.change_per = ((x.ltp - x.buy_price) * 100) / x.buy_price;
    x.gross = (x.ltp - x.buy_price) * x.quantities;
    let is_open = x.sell_price == undefined || x.sell_price == null || x.sell_price == 0;
    let closed_sum = is_open ? 0 : x.sell_price * x.quantities;

    let tax_info = undefined;
    let total_tax = 0;
    if (isSameDay(x.buy_ts, x.sell_ts)) {
      tax_info = cal_intraday_tax(x.buy_price, x.sell_price || ltp, x.quantities);
      total_tax = tax_info.total_tax;
    } else {
      tax_info = cal_delivery_tax(x.buy_price, x.sell_price || ltp, x.quantities);
      total_tax = tax_info.total_tax;
    }

    let cur_result: TOrder = {
      _id: x._id,
      index: index++,
      symbol: x.symbol,
      buy_price: x.buy_price,
      sell_price: x.sell_price || null,
      ltp: ltp, // todo
      ltp_change: 0, // TODO
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
      total_tax: total_tax,
    };
    // dlog.d(cur_result);
    orderList.push(cur_result);
    // update in map.
    if (!consolidatedMap.has(cur_result.symbol)) {
      consolidatedMap.set(cur_result.symbol, new Array());
    }
    consolidatedMap.get(cur_result.symbol)?.push(cur_result);
  }

  // compute the consolidatedList
  let i = 1;
  for (let [symbol, value] of consolidatedMap) {
    let total_stock = 0;
    let total_invested = 0;
    let total_tax = 0;
    for (var x of value) {
      if (!x.is_open) {
        continue;
      }
      total_stock += x.quantities;
      total_invested += x.quantities * x.buy_price;
      total_tax += x.total_tax;
    }
    let ltp = curMarket.ltpMap.get(symbol.toUpperCase());
    if (!ltp) {
      dlog.e("Not found LTP for stock:");
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
      total_tax: total_tax,
    });
  }

  // compute position summary
  let positionSummary1: TPositionSummary = {
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
    net_profit: 0,
  };
  let closed_order_invested_sum = 0;
  let closed_order_closed_sum = 0;
  let total_tax = 0;

  for (var order of orderList) {
    if (order.is_open) {
      positionSummary1.open_order_count++;
      positionSummary1.invested_amount += order.invested_sum;
      positionSummary1.current_amount += order.current_sum;
    } else {
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
  orderList.sort((a: TOrder, b: TOrder) => {
    return a.is_open ? -1 : 1;
  });

  let position: TPosition = {
    orderList: orderList,
    positionSummary: positionSummary1,
    consolidatedList: consolidatedList,
  };
  //dlog.obj(position)
  return position;
}
