import { TMarket, TPosition, TSummary } from "../models/model";
export type TAction = {
  type: "SET_COUNTER" | "MARK_BOOT_COMPLETE" | "UPDATE_USER_INFO" | "MARK_USER_SIGNED_OUT" | "UPDATE_MARKET" | "UPDATE_SUMMARY" | "UPDATE_POSITION";
  payload?: any;
};

export type TUserInfo = {
  name: string;
  email: string;
  user_id: string;
};

export type TAppState = {
  //test
  counter: number;

  isBootComplete: boolean;
  //user info
  isLoggedIn: boolean;
  userInfo: TUserInfo;
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
    user_id: "unknown",
  },
  isSummaryLoaded: false,
  isPositionLoaded: false,
  isLatestMarketDataLoaded: false,
  isBootComplete: false,
};
