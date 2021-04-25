export type TCoreScreenType = "BOOT" | "NUX" | "SIGN_IN" | "SIGN_UP" | "SIGN_OUT" | "SIGN_IN_COMPLETE";

export type TVoidCalBack = Function;

export type TAuthInfo = {
  user_id: string;
  name: string;
  email?: string;
  profile_image: string;
};

export type TCoreAction = {
  type: "MERGE_STATE";
  payload?: any;
};

export type TCoreState = {
  current_screen: TCoreScreenType;

  isBootComplete: boolean;
  isNuxShown: boolean;
  isUserLoggedIn: boolean;
  isSilentSignInComplete: boolean;
  showHomeScreen: boolean;

  // user
  authInfo: TAuthInfo | null;
};
