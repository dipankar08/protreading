import { TMarket, TPosition, TSummary } from "../models/model";
export type TAction = {
  type: "SET_COUNTER" | "MARK_BOOT_COMPLETE" | "MARK_USER_SIGN_IN" | "MARK_USER_SIGNED_OUT" | "UPDATE_MARKET" | "UPDATE_SUMMARY" | "UPDATE_POSITION";
  payload?: any;
};

export type TAppState = {
  //test
  counter: number;

  isBootComplete: boolean;
  //user info
  isLoggedIn: boolean;
  userInfo: any;
  //summary
  isSummaryLoaded: boolean;
  summary?: TSummary;
  //market
  isLatestMarketDataLoaded: boolean;
  market?: TMarket;

  //position
  isPositionLoaded: boolean;
  position?: TPosition;
};

export const initialState: TAppState = {
  counter: 1,
  isLoggedIn: false,
  userInfo: {
    name: "Guest",
    email: "",
  },
  isSummaryLoaded: false,
  isPositionLoaded: false,
  isLatestMarketDataLoaded: false,
  isBootComplete: false,
};
