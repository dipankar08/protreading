export type TObject = { [key: string]: any };
export type TRecord = { [key: string]: string };

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
  symbol: string;
  name: string;
  close: number;
  change: number;
};

export type TSummary = {
  tags: TKeyText[];
  data: { [key: string]: Array<TMarketEntry> };
};

export type TMarket = {
  stocks: Array<TMarketEntry>;
  ltpMap: Map<string, number>;
  sectorList: Map<string, Array<TMarketEntry>>;
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
  change: number;
  change_per: number;
  gross: number;
  ltp: number;
  ltp_change: number;
  orderList: Array<TOrder>;
};

export type TPositionSummary = {
  invested_amount: number;
  current_amount: number;
  change_amount: number;
  change_per: number;
};

export type TPosition = {
  orderList: Array<TOrder>;
  positionSummary: TPositionSummary;
  consolidatedList: Array<TOrder>;
};
