// convert network json data to right data format.
import { dlog } from "../libs/dlog";
import { emptyPositionSummary, TGroupMarketEntry, TMarketEntry, TObject, TPosition } from "./model";
import { getRecommendedMap, getSectorMap, processPositionData } from "./helper";

class DataProcessor {
  summary: Map<string, TGroupMarketEntry> = new Map(); // mainly show the summary
  stockMap: Map<string, TMarketEntry> = new Map();
  ltpMap: Map<string, number> = new Map();
  sectorList: Map<string, TGroupMarketEntry> = new Map();
  recommendedList: Map<string, TGroupMarketEntry> = new Map();
  position: TPosition = { orderList: [], positionSummary: emptyPositionSummary, consolidatedList: [] };

  constructor() {}

  // trying to process summary network resp.
  setSummary(obj: TObject) {
    dlog.d("Process Summary Data ...");
    try {
      obj = obj.data as Object;
      for (let c of Object.keys(obj)) {
        let value = obj[c] as TMarketEntry[];
        this.summary.set(c, {
          _id: c,
          title: c.replace("_", " "),
          count: value.length,
          group: value,
          avg_change: 0,
        });
      }
      dlog.d("setSummary Success");
    } catch (e) {
      dlog.e("Exception while computing summary");
      dlog.ex(e);
    }
  }

  mayUpdateStockData(key: string, data: TObject) {
    if (!this.stockMap.has(key)) {
      this.stockMap.set(key, {
        _id: key,
        name: data.name || key,
        symbol: data.symbol || key,
        close: data.close || data.Close || 0,
        rsi: data.rsi_14 || -1,
        sector: data.sector || [],
        change: data.close_change_percentage || 0, // replace
      });
    }
    if (data.close_change_percentage) {
      this.stockMap.get(key)!.change = data.close_change_percentage;
    }
    if (data.Close) {
      this.stockMap.get(key)!.close = data.Close;
    }
    if (data.close) {
      this.stockMap.get(key)!.close = data.close;
    }
    if (data.rsi_14) {
      this.stockMap.get(key)!.rsi = data.rsi_14;
    }
  }

  // Trying to process market info
  // this will build stock map and ltp
  setMarket(obj: TObject) {
    dlog.d("Processing Market data.....");
    try {
      let mergeObject: Map<string, TObject> = new Map();
      for (let entry of Object.keys(obj.indicator.data)) {
        mergeObject.set(entry, obj.indicator.data[entry]);
      }
      for (let entry of Object.keys(obj.latest.data)) {
        let x = mergeObject.get(entry) as TObject;
        x["close"] = obj.latest.data[entry].Close;
      }
      // clear old data as data may change
      this.stockMap.clear();
      for (let key of mergeObject.keys()) {
        let value = mergeObject.get(key) as TObject;
        this.stockMap.set(key, {
          name: value["name"],
          symbol: value["symbol"],
          close: value["close"],
          rsi: value["rsi_14"],
          sector: value["sector"],
          change: value["close_change_percentage"] || 0,
          _id: key,
          indicator: value,
        });
      }
      dlog.d("set market success");
      this.recomputeGroup();
    } catch (err) {
      dlog.ex(err);
    }
  }

  // Trying to process Latest Indicator Info
  setIndicator(obj: TObject) {
    dlog.d("Processing Market data.....");
    try {
      let objList: TObject = obj.data as Object;
      for (let c of Object.keys(objList)) {
        this.mayUpdateStockData(c, objList[c]);
        objList[c].symbol = c;
      }
      dlog.d("set market success");
      this.recomputeGroup();
    } catch (err) {
      dlog.ex(err);
    }
  }

  // Trying to process Position
  setPositionData(inp: TObject) {
    this.position = processPositionData(inp, this.ltpMap);
  }

  recomputeGroup() {
    // Process Entry.
    dlog.d("start recompute");
    this.stockMap.forEach((value, key) => {
      // 1. Find Recomendation
      this.ltpMap.set(key, value.close);
      let rsi = value.rsi;
      if (rsi != -1 && rsi > 70) {
        value.recommended_to_sell =
          "We recommended to sell this stock as this stock moved to overbought zone. It's expected that the people will start selling now.";
      }
      if (rsi != -1 && rsi < 30) {
        value.recommended_to_buy =
          "We recommended to buy this stock as this stock moved to oversold zone. It's expected that the people will start buying now.";
      }
    });
    this.sectorList = getSectorMap(Array.from(this.stockMap.values()));
    this.recommendedList = getRecommendedMap(Array.from(this.stockMap.values()));
    dlog.d("end recompute");
    // If position exist, we might need to update that two.
  }

  setLatestIndicator(inp: Object) {
    //todo
  }
}
export const processor = new DataProcessor();
