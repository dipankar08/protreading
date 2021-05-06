import { TGroupMarketEntry, TMarket, TPosition } from "../models/model";
export type TAction = {
  type: "MERGE";
  payload?: TAppStateOptional;
};

export type TDomain = "IN" | "USA" | "UK";

export type TAppState = {
  //summary
  summary: Map<string, TGroupMarketEntry>;
  ltpMap: Map<string, number>;
  sectorList: Map<string, TGroupMarketEntry>;
  recommendedList: Map<string, TGroupMarketEntry>;
  position?: TPosition;
  domain: TDomain;
};

export type TAppStateOptional = {
  summary?: Map<string, TGroupMarketEntry>;
  ltpMap?: Map<string, number>;
  sectorList?: Map<string, TGroupMarketEntry>;
  recommendedList?: Map<string, TGroupMarketEntry>;
  position?: TPosition;
};

export const initialState: TAppState = {
  summary: new Map(),
  ltpMap: new Map(),
  sectorList: new Map(),
  recommendedList: new Map(),
  domain: "IN",
};
