import { getObj } from "../../libs/storage";

// Add More state here as needed
export type TLoginInfo = {
  name: string;
  id: string;
  email: string;
  profilePicture: string;
};

export type TCoreState = {
  loginInfo?: TLoginInfo | undefined;
};

export const defaultCoreState: TCoreState = {
  loginInfo: getObj("LOGIN_INFO") as TLoginInfo,
};

export type TCoreReducerType = {
  type: "UPDATE";
  payload: TCoreState;
};
