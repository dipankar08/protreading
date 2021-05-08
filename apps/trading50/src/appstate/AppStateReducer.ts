import { dlog } from "../libs/dlog";
import { initialState, TAction, TAppState } from "./types";
export let globalAppState: TAppState = initialState;
const AppStateReducer = (state: TAppState, action: TAction): TAppState => {
  dlog.d(`[AppStateReducer] updating app state for ${action.type}`);
  switch (action.type) {
    case "MERGE":
      globalAppState = {
        ...state,
        ...action.payload,
      };
      break;
    default:
      globalAppState = state;
  }
  return globalAppState;
};
export default AppStateReducer;
