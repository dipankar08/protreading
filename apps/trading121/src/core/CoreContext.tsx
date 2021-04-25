import { createContext, useReducer } from "react";
import _ from "underscore";
import { dlog } from "../libs/dlog";
import { TCoreAction, TCoreState } from "./core_model";

// reducer
const AppStateReducer = (state: TCoreState, action: TCoreAction): TCoreState => {
  dlog.d(`[AppStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "MERGE_STATE":
      return _.extend({}, state, action.payload);
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
  const [state, dispatch]: [TCoreState, React.Dispatch<any>] = useReducer(AppStateReducer, initialCoreState);
  return <CoreStateContext.Provider value={{ state: state, dispatch: dispatch }}>{children}</CoreStateContext.Provider>;
};

export default CoreStateStoreProvider;
