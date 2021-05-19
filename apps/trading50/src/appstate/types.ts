import { TGroupMarketEntry, TMarketEntry, TPosition } from "../models/model";
export type TAction = {
  type: "MERGE";
  payload?: TAppStateOptional;
};

export type TDomain = "IN" | "USA" | "UK" | null;

export type TAppState = {
  //summary
  summary: Map<string, TGroupMarketEntry>;
  ltpMap: Map<string, number>;
  sectorList: Map<string, TGroupMarketEntry>;
  recommendedList: Map<string, TGroupMarketEntry>;
  stockMap: Map<string, TMarketEntry>;
  position?: TPosition;
  domain: TDomain;
  screenResultList: Array<TMarketEntry>;
};

export type TAppStateOptional = {
  summary?: Map<string, TGroupMarketEntry>;
  ltpMap?: Map<string, number>;
  sectorList?: Map<string, TGroupMarketEntry>;
  recommendedList?: Map<string, TGroupMarketEntry>;
  position?: TPosition;
  stockMap?: Map<string, TMarketEntry>;
  domain?: TDomain;
  screenResultList?: Array<TMarketEntry>;
};

export const initialState: TAppState = {
  summary: new Map(),
  ltpMap: new Map(),
  sectorList: new Map(),
  recommendedList: new Map(),
  domain: null,
  stockMap: new Map(),
  screenResultList: [],
};
