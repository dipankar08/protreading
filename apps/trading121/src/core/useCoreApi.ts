import React, { useContext } from "react";
import { dlog } from "../libs/dlog";
import { getBool, getData, saveData, setBool } from "../libs/stoarge";
import { CoreStateContext } from "./CoreContext";
import { CompleteSignInScreen } from "./CompleteSignInScreen";
import { SignInScreen } from "../screens/ThemeTest";
import { NuxScreen } from "./NUXScreen";
import { TCoreScreenType, TVoidCalBack } from "./core_model";

export const useCoreApi = () => {
  const coreState = useContext(CoreStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // find-out the right navigation
  async function navigateNext(curScreen: TCoreScreenType, navigation: any) {
    // Order of this ladder is important
    if (!coreState.state.isNuxShown) {
      navigation.push("NuxScreen");
      return;
    }

    // If no login information.
    if (!coreState.state.authInfo == null) {
      navigation.push("SignInScreen");
      return;
    }
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
    return await getBool("NUX_SHOWN");
  }

  async function doMarkNuxShown(onSuccess: TVoidCalBack) {
    await setBool("NUX_SHOWN", true);
    onSuccess();
  }

  async function doSignIn() {
    try {
      //pass
    } catch (err) {
      dlog.ex(err);
      setError("Not able to signin the app");
    }
  }

  async function doCompleteSignIn(onSuccess: TVoidCalBack) {
    try {
      // fetch info after sign-in.
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
