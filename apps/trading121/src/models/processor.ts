// convert network json data to right data format.
import { TKeyText, TMarket, TMarketEntry, TOrder, TPosition, TPositionSummary, TSummary } from "./model";

export function processMarketData(obj: any): TMarket {
  //console.log(obj);
  obj = obj.data;

  let stocks: Array<TMarketEntry> = [];
  let ltpMap: Map<string, number> = new Map();
  for (let c of Object.keys(obj)) {
    ltpMap.set(c, obj[c].close);
    obj[c].symbol = c;
    stocks.push(obj[c]);
  }
  let market: TMarket = {
    stocks: stocks,
    ltpMap: ltpMap,
  };
  return market;
}

export function processSummaryData(obj: any): TSummary {
  let tags: TKeyText[] = new Array();
  let data = {};
  obj = obj.data;
  for (let c of Object.keys(obj)) {
    data[c] = obj[c];
    tags.push({ key: c, text: c.replace("_", "") });
  }

  let summary: TSummary = {
    tags: tags,
    data: data,
  };
  return summary;
}

export function processPositionData(obj: any, curMarket: TMarket): TPosition {
  let orderList = new Array<TOrder>();

  let consolidatedList = new Array<TOrder>();
  let invested_amount_total = 0;
  let current_amount_total = 0;

  for (var x of obj) {
    //console.log(">>> COMPUTERD");
    let symbol: string = x.symbol;
    let close = curMarket.ltpMap.get(symbol.toUpperCase());
    //console.log(x);
    if (!close) {
      continue;
    }
    x.last_price = close; //x.latest;
    //console.log(latest);
    x.open_for = "4 days";
    //console.log(x.sell_price == 0);
    x.invested_amount = x.buy_price * x.quantities;
    x.current_amount = x.last_price * x.quantities;
    x.change = x.current_amount - x.invested_amount;
    x.change_per = ((x.last_price - x.buy_price) * 100) / x.buy_price;
    x.gross = (x.last_price - x.buy_price) * x.quantities;
    let cur_result = {
      _id: x._id,
      symbol: x.symbol,
      buy_price: x.buy_price,
      sell_price: x.sell_price || null,
      last_price: x.last_price, // todo
      buy_ts: x.buy_ts,
      sell_ts: x.sell_ts || null,
      quantities: x.quantities,
      is_open: x.sell_price == null || x.sell_price == 0,
      is_gain: x.buy_price > x.last_price,
      open_for: x.open_for,
      invested_sum: x.invested_amount.toFixed(2),
      change: x.change.toFixed(2),
      change_per: x.change_per.toFixed(2),
      gross: x.gross.toFixed(2),
    };
    // console.log(cur_result);
    orderList.push(cur_result);
    if (cur_result.is_open) {
      invested_amount_total += x.invested_amount;
      current_amount_total += x.current_amount;
    }
  }

  let positionSummary: TPositionSummary = {
    invested_amount: invested_amount_total,
    current_amount: current_amount_total,
    change_amount: current_amount_total - invested_amount_total,
    change_per: ((current_amount_total - invested_amount_total) / invested_amount_total) * 100,
  };

  let position: TPosition = {
    orderList: orderList,
    positionSummary: positionSummary,
    consolidatedList: consolidatedList,
  };
  return position;
}
