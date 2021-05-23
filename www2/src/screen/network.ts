import { getRequest } from "../libs/network";
import { TCallback } from "../libs/types";

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
