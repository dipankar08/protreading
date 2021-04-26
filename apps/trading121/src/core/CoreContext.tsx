import React from "react";
import { createContext, useReducer } from "react";
import _ from "underscore";
import { dlog } from "../libs/dlog";
import { TCoreAction, TCoreState } from "./core_model";

// reducer
const CoreStateReducer = (state: TCoreState, action: TCoreAction): TCoreState => {
  dlog.d(`[CoreStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "MERGE_STATE":
      let state1 = _.extend({}, state, action.payload);
      console.log(state1);
      return state1;
    default:
      return state;
  }
};

let initialCoreState: TCoreState = {
  current_screen: "BOOT",
  isBootComplete: false,
  isNuxShown: false,
  isUserLoggedIn: false,
  isSilentSignInComplete: false,
  authInfo: null,
  showHomeScreen: false,
};

type TBind = {
  state: TCoreState;
  dispatch: React.Dispatch<TCoreAction>;
};

export const CoreStateContext = createContext<TBind>({ state: initialCoreState, dispatch: () => {} });

const CoreStateStoreProvider = ({ children }: any) => {
  const [state, dispatch]: [TCoreState, React.Dispatch<any>] = useReducer(CoreStateReducer, initialCoreState);
  return <CoreStateContext.Provider value={{ state: state, dispatch: dispatch }}>{children}</CoreStateContext.Provider>;
};

export default CoreStateStoreProvider;
