import React, { createContext, useReducer } from "react";
import { dlog } from "../libs/dlog";
import { TCoreAction, TCoreState } from "./core_model";

let initialCoreState: TCoreState = {
  current_screen: "BOOT",
  isBootComplete: false,
  isNuxShown: false,
  isUserLoggedIn: false,
  isSilentSignInComplete: false,
  authInfo: null,
  showHomeScreen: false,
};

// dispatch function is async so the state is not modifed properluy. Use this flobal vetibale for soirec of touth
export let globalCoreState = initialCoreState;

// reducer
const CoreStateReducer = (state: TCoreState, action: TCoreAction): TCoreState => {
  dlog.d(`[CoreStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "MERGE_STATE":
      dlog.d(`merge state called with ${JSON.stringify(action)}`);
      globalCoreState = {
        ...state,
        ...action.payload,
      };
      return globalCoreState;
    default:
      return state;
  }
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
