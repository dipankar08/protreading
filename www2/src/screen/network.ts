import { getRequest, postRequest } from "../libs/network";
import { TCallback, TObject } from "../libs/types";

export type StockResult = {
  _id: string;
  name: string;
  close: number;
  change: number;
  volume: number;
  rsi_14: number;
  symbol: string;
};

export async function runQuery(url: string, callback: TCallback) {
  let result: Array<StockResult> = [{ _id: "1", name: "test", close: 0, change: 0, volume: 0, rsi_14: 0, symbol: "" }];
  callback.onBefore?.();
  try {
    let result = await getRequest(url);
    callback.onSuccess?.(result);
    callback.onComplete?.();
  } catch (err) {
    callback.onError?.(err.message);
    callback.onComplete?.();
  }
}

export async function saveFilter(data: TObject, callback: TCallback) {
  callback.onBefore?.();
  try {
    let result = await postRequest("https://api.grodok.com/api/trading50_filters/insert", data);
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
    let result = await getRequest(`https://api.grodok.com/api/trading50_filters?${q.trim().length > 0 ? `title=regex:${q}` : ""}`);
    callback.onSuccess?.(result);
    callback.onComplete?.();
  } catch (err) {
    callback.onError?.(err.message);
    callback.onComplete?.();
  }
}
