// Add More state here as needed
export type TLoginInfo = {
  name: string;
  id: string;
  email: string;
  profilePicture: string;
};

export type TCoreState = {
  loginInfo?: TLoginInfo;
};

export const defaultCoreState: TCoreState = {
  loginInfo: undefined,
};

export type TCoreReducerType = {
  type: "UPDATE";
  payload: TCoreState;
};
