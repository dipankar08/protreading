import React, { createContext, useReducer } from "react";
import AppStateReducer from "./AppStateReducer";
import { initialState, TAction, TAppState } from "./types";

type TBind = {
  state: TAppState;
  dispatch: React.Dispatch<TAction>;
};

export const AppStateContext = createContext<TBind>({ state: initialState, dispatch: () => {} });

const AppStateStoreProvider = ({ children }: any) => {
  const [state, dispatch]: [TAppState, React.Dispatch<any>] = useReducer(AppStateReducer, initialState);
  return <AppStateContext.Provider value={{ state: state, dispatch: dispatch }}>{children}</AppStateContext.Provider>;
};

export default AppStateStoreProvider;
