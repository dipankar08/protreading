import { getRequest, postRequest } from "../libs/network";
import { fromNow } from "../libs/time";
import { TCallback, TObject } from "../libs/types";

export type TStockListItem = {
  _id: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  rsi_14: number;
  symbol: string;
  domain:number,
  graphURL:string,
  tvTicker:string, // treading view tocketr
};

export type TFilterHistoryItem = {
  _id?:string,
  title:string,
  desc:string,
  filter:string,
  columns?:string
}

export async function runQuery(filter: string, domain:string, columns:string, callback: TCallback) {
  
   let url = `https://dev.api.grodok.com:5000/screen?filter=${encodeURIComponent(filter.toLowerCase())}&domain=${domain}&columns=${columns}`;
   let listItem: Array<TStockListItem> = [];
    callback.onBefore?.();
   try {
        let result = await getRequest(url);
        console.log(result);
        let data = result as TObject;
        for(var x of data.out.result){
          listItem.push({
            _id:x.symbol,
            name:x.name,
            symbol:x.symbol,
            graphURL:getChartURL(x.symbol, domain),
            domain:x.domain, 
            close:x.close,
            change:x.change,
            volume:x.volume,
            rsi_14:x.rsi_14,
            tvTicker:getTVSymbol(x.symbol, domain)
          })
        }
        
        let timestamp = 
          Object.keys(data.out.timestamp)
            .map((x) => {
              if (data.out.timestamp[x] != "Data not found") {
                return `${x} updated on ${fromNow(data.out.timestamp[x])}. `;
              }
            })
            .join("")
      
    callback.onSuccess?.({result:listItem, timestamp:timestamp, error:data.out.error});
    callback.onComplete?.();
  } catch (err) {
    callback.onError?.(err.message);
    callback.onComplete?.();
  }
}

export async function deleteFilter(data: TFilterHistoryItem, callback: TCallback) {
  callback.onBefore?.();
  try {
    let result = await getRequest(`https://api.grodok.com/api/trading50_filter/delete?id=${data._id}`);
    callback.onSuccess?.(result);
    callback.onComplete?.();
  } catch (err) {
    callback.onError?.(err.message);
    callback.onComplete?.();
  }
}

export async function saveFilter(data: TFilterHistoryItem, callback: TCallback) {
  callback.onBefore?.();
  try {
    let result = await postRequest("https://api.grodok.com/api/trading50_filter/insert", data);
    callback.onSuccess?.(result);
    callback.onComplete?.();
  } catch (err) {
    callback.onError?.(err.message);
    callback.onComplete?.();
  }
}
export async function searchHistoryFilter(q: string, callback: TCallback) {
  callback.onBefore?.();
  try {
    let result = await getRequest(`https://api.grodok.com/api/trading50_filter?${q.trim().length > 0 ? `title=regex:${q}` : ""}`);
    callback.onSuccess?.(result);
    callback.onComplete?.();
  } catch (err) {
    callback.onError?.(err.message);
    callback.onComplete?.();
  }
}

function getChartURL(symbol: string, domain:string ):string {
  if (domain == "IN") {
    return `https://uk.tradingview.com/chart/?symbol=NSE:${symbol.replace(".NS", "")}`;
  } else if (domain == "USA") {
    return `https://uk.tradingview.com/chart/?symbol=${symbol.replace(".NS", "")}`;
  } else if (domain == "UK") {
    return `https://uk.tradingview.com/chart/?symbol=${symbol.replace(".L", "")}`;
  } else {
     return `https://uk.tradingview.com/chart/?symbol=${symbol.replace(".L", "")}`;
  }
}

function getTVSymbol(symbol: string, domain:string ):string {
  if (domain == "IN") {
    return `NSE:${symbol.replace(".NS", "")}`;
  } else if (domain == "USA") {
    return `${symbol.replace(".NS", "")}`;
  } else if (domain == "UK") {
    return `${symbol.replace(".L", "")}`;
  } else {
     return `${symbol.replace(".L", "")}`;
  }
}
