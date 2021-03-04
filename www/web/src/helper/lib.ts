import { PostOnSimpleStore, GetOnSimpleStore } from "@/common/network";
import { TArray, TObject, TOnError, TOnSuccess } from "@/common/types";
import _ from "underscore";
let STOCK_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:5000" : "https://rc1.grodok.com:5000";
console.log(`Endpoint --> ${STOCK_ENDPOINT}`);

export function perform_scan(filter: string, columns: Array<string>, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`${STOCK_ENDPOINT}/screen?filter=${filter}&columns=${columns.join(",")}`, onSuccess, onError);
}
export function perform_back_test(
  symbol: string,
  candle_type: string,
  duration: string,
  entry_rule: string,
  exit_rule: string,
  onSuccess: TOnSuccess,
  onError: TOnError
) {
  GetOnSimpleStore(
    `${STOCK_ENDPOINT}/backtest?symbol=${symbol}&duration=${duration}&candle_type=${candle_type}&entry_rule=${entry_rule}&exit_rule=${exit_rule}`,
    onSuccess,
    onError
  );
}

export function downloadData(candle_type: string, duration: string, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`${STOCK_ENDPOINT}/snapshot?candle_type=${candle_type}&duration=${duration}`, onSuccess, onError);
}

export function save_scan(data: TObject, onSuccess: TOnSuccess, onError: TOnError) {
  PostOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan/create`, data, onSuccess, onError);
}
export function get_scan(onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan`, onSuccess, onError);
}
export function delete_scan(id: string, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan/delete?id=${id}`, onSuccess, onError);
}
export function get_scan_for_id(id: string, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan?id=${id}`, onSuccess, onError);
}
export function getColFormatForData(data: TObject) {
  let result = [];
  for (const property in data) {
    if (["sl", "symbol", "name"].indexOf(property) > -1) {
      result.push({
        title: property,
        dataIndex: property,
        sorter: (a: any, b: any) => {
          return a.name.localeCompare(b.name);
        },
      });
    } else {
      result.push({
        title: property,
        dataIndex: property,
        sorter: (a: any, b: any) => {
          return a.close_change - b.close_change;
        },
      });
    }
  }
  return result;
}