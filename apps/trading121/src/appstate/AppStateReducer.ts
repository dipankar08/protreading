import { dlog } from "../libs/dlog";
import { initialState, TAction, TAppState } from "./types";
export let globalAppState: TAppState = initialState;
const AppStateReducer = (state: TAppState, action: TAction): TAppState => {
  dlog.d(`[AppStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "UPDATE_MARKET":
      globalAppState = {
        ...state,
        market: action.payload,
        isLatestMarketDataLoaded: action.payload != null,
      };
      break;
    case "UPDATE_SUMMARY":
      globalAppState = {
        ...state,
        summary: action.payload,
        isSummaryLoaded: action.payload != null,
      };
      break;
    case "UPDATE_POSITION":
      globalAppState = {
        ...state,
        position: action.payload,
        isPositionLoaded: action.payload != null,
      };
      break;
    default:
      globalAppState = state;
  }
  return globalAppState;
};
export default AppStateReducer;
