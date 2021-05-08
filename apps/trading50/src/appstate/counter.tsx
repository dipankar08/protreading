import React, { createContext, useReducer } from "react";

type TBind = {
  counterCount: number;
  dispatchCount?: any;
};

export const CounterContext = createContext<TBind>({ counterCount: 0, dispatchCount: undefined });
const initialState = 0;
const reducer = (state: number, action: any): number => {
  return state + 1;
};

export const CounterProvider = ({ children }: any) => {
  const [count, dispatch] = useReducer(reducer, initialState);
  return <CounterContext.Provider value={{ counterCount: count, dispatchCount: dispatch }}>{children}</CounterContext.Provider>;
};
