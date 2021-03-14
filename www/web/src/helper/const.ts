import sync from "./sync.json";
export const NIFTY_200 = sync.SUPPORTED_SYMBOL;
export const INDICATOR_LIST = sync.SUPPORTED_INDICATOR;

export let CANDLE_TYPE_LIST = [
  { key: "5m", text: "5min" },
  { key: "15m", text: "15 min" },
  { key: "1h", text: "1 hour" },
  { key: "1d", text: "1d" },
];

export let DURATION_TYPE_LIST = [
  { key: "90", text: "3 months" },
  { key: "180", text: "6 months" },
  { key: "365", text: "1 years" },
  { key: "730", text: "2 years" },
];

export let SHORT_CANDLE_DURATION = [
  { key: "30", text: "30" },
  { key: "60", text: "60" },
  { key: "90", text: "90" },
  { key: "180", text: "180" },
];

export let OFFSET_LIST = [
  { key: "1d:0", text: "[0]Day" },
  { key: "1d:-1", text: "[-1]Day" },
  { key: "1d:-2", text: "[-2]Day" },
  { key: "1d:-3", text: "[-3]Day" },
  { key: "1d:-4", text: "[-4]Day" },
  { key: "1d:-5", text: "[-5]Day" },
  { key: "5m:0", text: "[0]5m" },
  { key: "5m:-1", text: "[-1]5m" },
  { key: "5m:-2", text: "[-2]5m" },
  { key: "5m:-3", text: "[-3]5m" },
  { key: "5m:-4", text: "[-4]5m" },
  { key: "5m:-5", text: "[-5]5m" },
  { key: "15m:0", text: "[0]15m" },
  { key: "15m:-1", text: "[-1]15m" },
  { key: "15m:-2", text: "[-2]15m" },
  { key: "15m:-3", text: "[-3]15m" },
  { key: "15m:-4", text: "[-4]15m" },
  { key: "15m:-5", text: "[-5]15m" },
  { key: "1h:0", text: "[0]1h" },
  { key: "1h:-1", text: "[-1]1h" },
  { key: "1h:-2", text: "[-2]1h" },
  { key: "1h:-3", text: "[-3]1h" },
  { key: "1h:-4", text: "[-4]1h" },
  { key: "1h:-5", text: "[-5]1h" },
];

export let OPERATOR_LIST = [
  { key: "==", text: "Equals to" },
  { key: "!=", text: "Not equals to" },
  { key: ">", text: "Greater than" },
  { key: "<", text: "Less then" },
  { key: ">=", text: "Greater or equal" },
  { key: "<=", text: "Lesser or equal " },
  { key: "+", text: "Plus" },
  { key: "-", text: "Minus" },
  { key: "*", text: "Multiply" },
  { key: "/", text: "Divide" },
];
export let COMMON_COLUMNS_LIST = [
  { key: "symbol", text: "symbol" },
  { key: "close", text: "close" },
  { key: "change", text: "change" },
];

export let SCREEN_COLUMNS_LIST: Array<any> = COMMON_COLUMNS_LIST;
for (let z of INDICATOR_LIST) {
  for (let x of CANDLE_TYPE_LIST) {
    for (let y = 0; y >= -1; y--) {
      SCREEN_COLUMNS_LIST.push({ key: `indicator:${x.key}:${y}:${z.key}`, text: `${x.key} [${y}] ${z.text}` });
    }
  }
}

export let LATEST_SCREEN_COLUMNS_LIST: Array<any> = COMMON_COLUMNS_LIST;
for (let z of INDICATOR_LIST) {
  for (let x of CANDLE_TYPE_LIST) {
    for (let y = 0; y >= 0; y--) {
      LATEST_SCREEN_COLUMNS_LIST.push({ key: `indicator:${x.key}:${y}:${z.key}`, text: `${x.key} ${z.text}` });
    }
  }
}

export let DEFAULT_FOCUS_GROUP = [
  {
    _id: "default",
    name: "Default Group",
    list: ["^NSEI", "WIPRO.NS", "DRREDDY.NS", "BAJAJ-AUTO.NS", "BHARTIARTL.NS", "BRITANNIA.NS", "GODREJCP.NS", "NAUKRI.NS"],
  },
  {
    _id: "default2",
    name: "Default Group 2",
    list: ["GODREJCP.NS", "NAUKRI.NS"],
  },
];
export let CHART_DISPLAY_CONFIG = [
  { key: "candle", text: "candle" },
  { key: "volume", text: "volume" },
];
