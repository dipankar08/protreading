export type TAction = {
  type:
    | "SET_COUNTER"
    | "MARK_BOOT_COMPLETE"
    | "MARK_USER_SIGN_IN"
    | "MARK_USER_SIGNED_OUT"
    | "UPDATE_MARKET_DATA"
    | "UPDATE_SUMMARY_DATA"
    | "UPDATE_POSITION_DATA";
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
  //market
  isLatestMarketDataLoaded: boolean;
  //position
  isPositionLoaded: boolean;
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
