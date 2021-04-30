import { TMarket, TPosition, TSummary } from "../models/model";
export type TAction = {
  type:
    | "MARK_LOGIN_SUCCESS"
    | "SET_COUNTER"
    | "MARK_BOOT_COMPLETE"
    | "UPDATE_USER_INFO"
    | "MARK_USER_SIGNED_OUT"
    | "UPDATE_MARKET"
    | "UPDATE_SUMMARY"
    | "UPDATE_POSITION";
  payload?: any;
};

// Some info
export type TUserInfo = {
  name: string;
  email: string;
  user_id: string;
};

export type TAppState = {
  //test

  //user info

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
  isSummaryLoaded: false,
  isPositionLoaded: false,
  isLatestMarketDataLoaded: false,
};
