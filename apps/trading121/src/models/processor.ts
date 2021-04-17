// convert network json data to right data format.
import { dlog } from "../libs/dlog";
import { TGroupMarketEntry, TKeyText, TMarket, TMarketEntry, TOrder, TPosition, TPositionSummary, TSummary } from "./model";

export function processMarketData(obj: any): TMarket {
  //dlog.d(obj);
  dlog.d("Processing Market data.....")
  obj = obj.data;

  let stocks: Array<TMarketEntry> = [];
  let ltpMap: Map<string, number> = new Map();
  let sectorMap :Map<string, TGroupMarketEntry> = new Map();
  for (let c of Object.keys(obj)) {
    ltpMap.set(c, obj[c].close);
    obj[c].symbol = c;
    obj[c].name = c;
    stocks.push(obj[c]);
    // calculate sector
    if( obj[c].sector){
      let sector = obj[c].sector[0];
      if(!sectorMap.has(sector)){
          sectorMap.set(sector, {
            title:sector,
            _id:sector,
            group:[],
            count:0,
            avg_change:0,
          });
      }
      let value = obj[c]
      sectorMap.get(sector)!.group.push({
        symbol: value.symbol,
        name: value.name,
        close: value.close,
        change: value.change,
      })
      sectorMap.get(sector)!.count = sectorMap.get(sector)!.count+1
    } else {
      dlog.d("No sector found...")
    }
  }
  let market: TMarket = {
    stocks: stocks,
    ltpMap: ltpMap,
    sectorList:sectorMap,
  };
  dlog.obj(market.sectorList)
  return market;
}

export function processSummaryData(obj: any): TSummary {
  dlog.d("Process Summary Data ...")
  dlog.obj(obj)
  let data:Map<string, TGroupMarketEntry> = new Map();
  obj = obj.data
  for (let c of Object.keys(obj)) {
    let value = obj[c] as TMarketEntry[]
    data.set(c, {
      _id:c,
      title:c.replace("_"," "),
      count:value.length,
      group:value,
      avg_change:0
    })
  }

  let summary: TSummary = {
    data: data,
  };
  dlog.obj(summary)
  return summary;
}

export function processPositionData(obj: any, curMarket: TMarket): TPosition {
  //dlog.obj(obj)
  let orderList = new Array<TOrder>();

  let consolidatedList = new Array<TOrder>();
  let consolidatedMap: Map<string, Array<TOrder>> = new Map();
  let invested_amount_total = 0;
  let current_amount_total = 0;
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
    x.open_for = "4 days";
    //dlog.d(x.sell_price == 0);
    x.invested_amount = x.buy_price * x.quantities;
    x.current_amount = x.ltp * x.quantities;
    x.change = x.current_amount - x.invested_amount;
    x.change_per = ((x.ltp - x.buy_price) * 100) / x.buy_price;
    x.gross = (x.ltp - x.buy_price) * x.quantities;
    let cur_result = {
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
      is_open: x.sell_price == null || x.sell_price == 0,
      is_gain: x.buy_price > x.ltp,
      open_for: x.open_for,
      invested_sum: x.invested_amount.toFixed(2),
      current_sum: x.current_amount.toFixed(2),
      change: x.change.toFixed(2),
      change_per: x.change_per.toFixed(2),
      gross: x.gross.toFixed(2),
    };
    // dlog.d(cur_result);
    orderList.push(cur_result);
    if (cur_result.is_open) {
      invested_amount_total += x.invested_amount;
      current_amount_total += x.current_amount;
    }
    // update in map.
    if (!consolidatedMap.has(cur_result.symbol)) {
      consolidatedMap.set(cur_result.symbol, new Array());
    }
    consolidatedMap.get(cur_result.symbol)?.push(cur_result);
  }

  let positionSummary: TPositionSummary = {
    invested_amount: parseFloat(invested_amount_total + "").toFixed(2),
    current_amount: parseFloat(current_amount_total + "").toFixed(2),
    change_amount: parseFloat(current_amount_total - invested_amount_total).toFixed(2),
    change_per: parseFloat(((current_amount_total - invested_amount_total) / invested_amount_total) * 100).toFixed(2),
  };

  // compute the consolidatedList
  let i =1;
  for (let [symbol, value:TOrder[]] of consolidatedMap) {
    let total_stock = 0;
    let total_invested = 0;
    for (var x:TOrder of value) {
      total_stock+= x.quantities
      total_invested+= x.quantities * x.buy_price;
    }
    let ltp = curMarket.ltpMap.get(symbol.toUpperCase());
    if(!ltp){
      dlog.e("Not found LTP for stock:")
      continue;
    }
    consolidatedList.push({
      index:i++,
      _id:symbol,
      symbol:symbol,
      ltp: ltp,
      ltp_change:0,

      quantities:total_stock,
      buy_price:(total_invested/total_stock),
      invested_sum:total_invested,
      current_sum:ltp*total_stock,
      change: ltp*total_stock - total_invested,
      change_per: (ltp*total_stock - total_invested)/total_invested*100,
      orderList:value,
      buy_ts:'',
      sell_ts:'',
      is_open:true, 
      is_gain: ltp*total_stock - total_invested> 0,
      sell_price:0,
      open_for:'4 days',
      gross:0,

    })
  }
  
  let position: TPosition = {
    orderList: orderList,
    positionSummary: positionSummary,
    consolidatedList: consolidatedList,
  };
  //dlog.obj(position)
  return position;
}
