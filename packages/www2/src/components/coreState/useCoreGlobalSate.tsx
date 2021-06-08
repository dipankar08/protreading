import { createContext, useState } from "react";
import { storeObj } from "../../libs/storage";
import { defaultCoreState, TCoreState } from "./stateSpec";

export  type TReducerFunction = (payload:TCoreState) => TCoreState; //({ type, payload }: TCoreReducerType): TCoreState 

const useGlobalCoreState = () => {
  const [state, setState] = useState<TCoreState>(defaultCoreState);
  const update:TReducerFunction = (payload) => {
         let newState:TCoreState = {...state, ...payload}
         setState(newState);
         if(payload.loginInfo){
           storeObj("LOGIN_INFO", payload.loginInfo)
         }
         return newState
  };
  return { state, update };
};

// define context
export const CoreContext = createContext<{state:TCoreState,update: TReducerFunction}>({state:defaultCoreState, update:(payload) => defaultCoreState});

// define provides
export const CoreContextProvider = ({ children }: any) => {
  const state = useGlobalCoreState();
  return <CoreContext.Provider value={state}>{ children }</CoreContext.Provider>;
};

// How to use this
// 1. Wrap your app as CoreContextProvider
// 2. Get and setstate as const coreContext = React.useContext(CoreContext);
// Just use itß
