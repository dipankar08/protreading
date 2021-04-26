import React, { useContext } from "react";
import { dlog } from "../libs/dlog";
import { getBool, getData, saveData, setBool } from "../libs/stoarge";
import { CoreStateContext } from "./CoreContext";
import { CompleteSignInScreen } from "./CompleteSignInScreen";
import { SignInScreen } from "../screens/ThemeTest";
import { NuxScreen } from "./NUXScreen";
import { TAuthInfo, TCoreScreenType, TErrorCallback, TVoidCalBack } from "./core_model";

export const useCoreApi = () => {
  const coreState = useContext(CoreStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // find-out the right navigation
  async function navigateNext(curScreen: TCoreScreenType, navigation: any) {
    dlog.d("Navigation Netx called==>");
    console.log(coreState.state);
    if (!coreState.state.isNuxShown) {
      console.log("Nix...");
      navigation.push("NuxScreen");
      return;
    }

    // If no login information.
    if (coreState.state.authInfo == null) {
      navigation.push("SignInScreen");
      return;
    }
    if (!coreState.state.isSilentSignInComplete) {
      navigation.push("CompleteSignInScreen");
      return;
    }
    // We have done everything.. DO not do anything now
  }

  async function doAppBoot(onSuccess: Function) {
    try {
      // Not doing anything..
      let authData = await getData("AUTH_INFO", null);
      coreState.dispatch({
        type: "MERGE_STATE",
        payload: {
          isBootComplete: true,
          isNUXShown: await isNUXShown(),
          authInfo: authData,
          isUserLoggedIn: authData != null,
          isSilentSignInComplete: false,
          showHomeScreen: false,
        },
      });
      onSuccess();
    } catch (err) {
      dlog.ex(err);
      setError("Not able to boot the app");
    }
  }

  async function isNUXShown() {
    let val = await getBool("NUX_SHOWN");
    return val;
  }

  async function doMarkNuxShown(onSuccess: TVoidCalBack) {
    await setBool("NUX_SHOWN", true);
    onSuccess();
  }

  async function doSignIn(authInfo: TAuthInfo, onSuccess: TVoidCalBack, onError?: TErrorCallback) {
    try {
      if (authInfo.user_id.length > 0) {
        onError?.("Please enter user_id");
      }
      await coreState.dispatch({ type: "MERGE_STATE", payload: { authInfo: authInfo } });
      await saveData("AUTH_INFO", authInfo);
      onSuccess();
    } catch (err) {
      dlog.ex(err);
      setError("Not able to signin the app");
    }
  }

  async function doCompleteSignIn(onSuccess: TVoidCalBack) {
    try {
      // fetch info after sign-in.
      // do some work..
      coreState.dispatch({ type: "MERGE_STATE", payload: { isSilentSignInComplete: true } });
      onSuccess();
    } catch (err) {
      dlog.ex(err);
      setError("Not able to fetch info after signIn");
    }
  }

  async function doSignOut() {
    try {
      //pass
    } catch (err) {
      dlog.ex(err);
      setError("Not able to SignOut");
    }
  }

  async function doSignUp() {
    try {
      //pass
    } catch (err) {
      dlog.ex(err);
      setError("Not able to SignUp");
    }
  }

  return { loading, error, doAppBoot, isNUXShown, doMarkNuxShown, doCompleteSignIn, doSignIn, doSignOut, doSignUp, navigateNext };
};
