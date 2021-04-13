import { TAction, TAppState } from "./types";
const AppStateReducer = (state: TAppState, action: TAction): TAppState => {
  console.log("updating app state...");
  switch (action.type) {
    case "SET_COUNTER":
      return {
        ...state,
        counter: state.counter + 1,
      };
    case "MARK_BOOT_COMPLETE":
      return {
        ...state,
        isBootComplete: true,
      };
    case "MARK_USER_SIGN_IN":
      return {
        ...state,
        isLoggedIn: true,
        userInfo: action.payload,
      };
    case "MARK_USER_SIGNED_OUT":
      return {
        ...state,
        isLoggedIn: false,
        userInfo: null,
      };
    default:
      return state;
  }
};
export default AppStateReducer;
