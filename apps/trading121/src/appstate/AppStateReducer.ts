import { TAction, TAppState } from "./types";
const AppStateReducer = (state: TAppState, action: TAction): TAppState => {
  //console.log(`[AppStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "SET_COUNTER":
      return {
        ...state,
        counter: state.counter + 1,
      };
    case "MARK_BOOT_COMPLETE":
      return {
        ...state,
        isBootComplete: true,
      };
    case "UPDATE_USER_INFO":
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.payload,
      };
    case "MARK_USER_SIGNED_OUT":
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
      };

    case "UPDATE_MARKET":
      return {
        ...state,
        market: action.payload,
        isLatestMarketDataLoaded: action.payload != null,
      };

    case "UPDATE_SUMMARY":
      return {
        ...state,
        summary: action.payload,
        isSummaryLoaded: action.payload != null,
      };

    case "UPDATE_POSITION":
      return {
        ...state,
        position: action.payload,
        isPositionLoaded: action.payload != null,
      };
    default:
      return state;
  }
};
export default AppStateReducer;
