export type TObject = { [key: string]: any };
export type TRecord = { [key: string]: string };

export enum RecommendedType {
  INTRADAY_BUY = "IntraDay Buy",
  INTRADAY_SELL = "IntraDay Sell",
  DELIVERY_BUY = "Delivery Buy",
  DELIVERY_SELL = "Delivery Sell",
}

export type TKeyText = {
  key: string;
  text: string;
};

export type TStockEntry = {
  key: string;
  text: string;
  type: string[];
};

export type TMarketEntry = {
  _id: string;
  symbol: string;
  name: string;
  close: number;
  change: number;
  recommended_to_buy?: string;
  recommended_to_sell?: string;
  rsi: number;
  sector?: string[];
  indicator?: TObject;
};

export type TGroupMarketEntry = {
  count: number;
  avg_change: number;
  _id: string;
  title: string;
  subtitle?: string;
  group: Array<TMarketEntry>;
};

export type TMarket = {
  stocks: Array<TMarketEntry>;
  ltpMap: Map<string, number>;
  sectorList: Map<string, TGroupMarketEntry>;
  recommendedList: Map<string, TGroupMarketEntry>;
};

export type TOrder = {
  _id: string;
  index: number;
  symbol: string;
  buy_price: number;
  sell_price: number;
  buy_ts: any;
  sell_ts: any;
  quantities: number;
  is_open: boolean;
  is_gain: boolean;
  open_for: string;
  invested_sum: number;
  current_sum: number;
  closed_sum: number;
  change: number;
  change_per: number;
  gross: number;
  ltp: number;
  ltp_change: number;
  orderList: Array<TOrder>;
  isBreakOrder: boolean;
  taxInfo?: Object;
  total_tax: number;
};

export type TPositionSummary = {
  invested_amount: number;
  current_amount: number;
  total_pl: number;
  total_change: number;
  committed_pl: number;
  committed_change: number;
  uncommitted_pl: number;
  uncommitted_change: number;
  open_order_count: number;
  net_profit: number;
  total_tax: number;
};

export const emptyPositionSummary: TPositionSummary = {
  invested_amount: 0,
  current_amount: 0,
  total_change: 0,
  total_pl: 0,
  total_tax: 0,
  committed_change: 0,
  committed_pl: 0,
  net_profit: 0,
  open_order_count: 0,
  uncommitted_change: 0,
  uncommitted_pl: 0,
};

export type TPosition = {
  orderList: Array<TOrder>;
  positionSummary: TPositionSummary;
  consolidatedList: Array<TOrder>;
};
