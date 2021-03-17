import { PostOnSimpleStore, GetOnSimpleStore } from "@/common/network";
import { TArray, TObject, TOnError, TOnSuccess } from "@/common/types";
import { rootVue } from "@/main";
import _ from "underscore";
import { LiveDataArray, LiveObject } from "../common/livedata";
let STOCK_ENDPOINT = process.env.NODE_ENV == "development" ? "http://localhost:5000" : "https://realtime.grodok.com:5000";
console.log(`Endpoint --> ${STOCK_ENDPOINT}`);

/// Define Live Data
export let liveAccountObject = new LiveObject(function(data, extra) {
  console.log("Live Object Updated");
  updateAcceount(data);
  if (extra?.success_msg) {
    notification(null, { status: "success", msg: extra.success_msg });
  }
});

/// Network APIs
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

export function compare(
  symbol_list: Array<string>,
  indicator_list: Array<string>,
  candle_type: string,
  duration: string,
  onSuccess: TOnSuccess,
  onError: TOnError
) {
  GetOnSimpleStore(
    `${STOCK_ENDPOINT}/relate?symbol_list=${symbol_list.join(",")}&indicator_list=${indicator_list.join(
      ","
    )}&candle_type=${candle_type}&duration=${duration}`,
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
export function search_scan(query: string, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan?title=regex:${query}`, onSuccess, onError);
}
export function delete_scan(id: string, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan/delete?id=${id}`, onSuccess, onError);
}
export function get_scan_for_id(id: string, onSuccess: TOnSuccess, onError: TOnError) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/grodok_stock_scan?id=${id}`, onSuccess, onError);
}

export function load_chart(
  symbol: string,
  candle_type: string,
  duration: number,
  reload: string,
  onSuccess: TOnSuccess,
  onError: TOnError,
  config?: TObject
) {
  GetOnSimpleStore(`${STOCK_ENDPOINT}/chart?symbol=${symbol}&candle_type=${candle_type}&duration=${duration}&reload=${reload}`, onSuccess, onError);
}

export function markLogin(user_id: string) {
  PostOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/protreader_account/insertorupdate`,
    {
      _field: "user_id",
      _payload: [{ user_id: user_id, last_login_time: new Date().toUTCString() }],
    },
    function() {
      fetchAccount(user_id);
    }
  );
}

export function fetchAccount(user_id: string) {
  GetOnSimpleStore(`https://simplestore.dipankar.co.in/api/protreader_account/?user_id=${user_id}`, function(data) {
    console.log(data);
    if (data?.length > 0) {
      liveAccountObject.override((data as any)[0]);
    }
  });
}

export function updateAcceount(data: TObject) {
  PostOnSimpleStore(
    `https://simplestore.dipankar.co.in/api/protreader_account/update`,
    data,
    function(data, org) {
      notification((window as any)._vue, org);
    },
    function(e, org) {
      notification((window as any)._vue, org);
    }
  );
}

export function getColFormatForData(data: TObject) {
  let result = [];
  for (const property in data) {
    if (["sl", "symbol", "name"].indexOf(property) > -1) {
      result.push({
        title: property,
        dataIndex: property,
        sorter: (a: any, b: any) => {
          return a[property].localeCompare(b[property]);
        },
      });
    } else {
      result.push({
        title: property,
        dataIndex: property,
        sorter: (a: any, b: any) => {
          return a[property] - b[property];
        },
      });
    }
  }
  return result;
}

export function notification(vue: any, data?: TObject) {
  if (!data) {
    return;
  }
  if (!vue) {
    vue = rootVue;
  }
  if (vue) {
    vue.$notification[data.status == "success" ? "success" : "error"]({
      message: `${data.msg}`,
      description: `${(data.help && data.help.substring(0, 500)) || "(No more information)"}`,
      placement: "bottomRight",
    });
  } else {
    console.log(`Ignore notification due to vue is null ${JSON.stringify(data)}`);
  }
}
