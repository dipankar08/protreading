import React, { createContext, useReducer } from "react";
import { dlog } from "../components/libs/dlog";
import { emptyPositionSummary, TGroupMarketEntry, TMarketEntry, TPosition } from "./model";

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
  position: TPosition;
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
  position: { orderList: [], positionSummary: emptyPositionSummary, consolidatedList: [] },
};

type TBind = {
  state: TAppState;
  dispatch: React.Dispatch<TAction>;
};

export let globalAppState: TAppState = initialState;
const AppStateReducer = (state: TAppState, action: TAction): TAppState => {
  dlog.d(`[AppStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "MERGE":
      globalAppState = {
        ...state,
        ...action.payload,
      };
      break;
    default:
      globalAppState = state;
  }
  return globalAppState;
};


export const AppStateContext = createContext<TBind>({ state: initialState, dispatch: () => {} });

const AppStateStoreProvider = ({ children }: any) => {
  const [state, dispatch]: [TAppState, React.Dispatch<any>] = useReducer(AppStateReducer, initialState);
  return <AppStateContext.Provider value={{ state: state, dispatch: dispatch }}>{children}</AppStateContext.Provider>;
};

export default AppStateStoreProvider;
