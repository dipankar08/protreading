import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import React, { useContext } from "react";
import { dlog } from "../libs/dlog";
import { deleteData, getBool, getData, saveData, setBool } from "../libs/stoarge";
import { CoreStateContext, globalCoreState } from "./CoreContext";
import { TAuthInfo, TCallback, TCoreScreenName, TVoidCalBack } from "./core_model";

export const useCoreApi = () => {
  const coreState = useContext(CoreStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // find-out the right navigation
  async function navigateNext(navigation: any) {
    dlog.d(`Navigation Next:${JSON.stringify(globalCoreState)}`);

    // Is show NUX.
    if (!globalCoreState.isNuxShown) {
      navigateTo(navigation, "NuxScreen");
      return;
    }

    // Do we have auth info
    if (!globalCoreState.authInfo) {
      navigateTo(navigation, "SignInScreen");
      return;
    }

    // Do we complate the silent login
    if (!globalCoreState.isSilentSignInComplete) {
      navigateTo(navigation, "CompleteSignInScreen");
      return;
    }
    // Now we can show the home, we dont have to do naything as we have the states
  }

  async function navigateTo(navigation: any, target: TCoreScreenName) {
    navigation.push(target);
  }

  async function doAppBoot(onSuccess: Function) {
    try {
      // Not doing anything..
      let authData = await getData("AUTH_INFO", null);
      coreState.dispatch({
        type: "MERGE_STATE",
        payload: {
          isBootComplete: true,
          isNuxShown: await isNuxShown(),
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

  async function isNuxShown() {
    let val = await getBool("NUX_SHOWN");
    return val;
  }

  async function doMarkNuxShown(onSuccess: TVoidCalBack) {
    await setBool("NUX_SHOWN", true);
    onSuccess();
  }

  async function saveAuthInfo(authInfo: TAuthInfo) {
    try {
      await coreState.dispatch({ type: "MERGE_STATE", payload: { authInfo: authInfo } });
      await saveData("AUTH_INFO", authInfo);
    } catch (err) {
      dlog.ex(err);
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
      // Delete saved data
      await deleteData("AUTH_INFO");
      await deleteData("NUX_SHOWN");

      coreState.dispatch({
        type: "MERGE_STATE",
        payload: {
          isBootComplete: true,
          isNuxShown: false,
          authInfo: null,
          isUserLoggedIn: false,
          isSilentSignInComplete: false,
          showHomeScreen: false,
        },
      });
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

  const FacebookSignIn = async (callback: TCallback) => {
    callback.onBefore?.();
    try {
      await Facebook.initializeAsync({
        appId: "223411552837244",
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile", "email"],
      });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        console.log(token);
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
        const data = await response.json();
        //const resp1 = await fetch(`https://graph.facebook.com/${data.id}/picture?type=square`);
        //const profile_pic = await resp1.json();
        // console.log(profile_pic);
        let authInfo: TAuthInfo = {
          user_id: data.email || data.id,
          email: data.email || data.id,
          profile_image: "",
          name: data.name,
        };
        saveAuthInfo(authInfo);
        callback.onSuccess?.({});
        callback.onComplete?.();
      } else {
        // type === 'cancel'
        callback.onError?.("User has canceled the login");
        callback.onComplete?.();
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
      callback.onError?.("Not able to login");
      callback.onComplete?.();
    }
  };

  const GoogleSignIn = async (callback: TCallback) => {
    console.log("Trying google signin");
    callback.onBefore?.();
    try {
      const result = await Google.logInAsync({
        androidClientId: "290736876800-h120tsplv4jdcf2676dogtjd26f2ftgd.apps.googleusercontent.com", //process.env.GOOGLE_AUTH_KEY,
        androidStandaloneAppClientId: "290736876800-h120tsplv4jdcf2676dogtjd26f2ftgd.apps.googleusercontent.com",
        scopes: ["profile", "email"],
      });

      console.log(result);

      if (result.type === "success" && result.user.email) {
        // console.log(result);
        let authInfo: TAuthInfo = {
          user_id: result.user.email,
          name: result.user.name || "Unknown Google User",
          email: result.user.email,
          profile_image: result.user.photoUrl,
        };
        saveAuthInfo(authInfo);
        callback.onSuccess?.(result);
        callback.onComplete?.();
      } else {
        callback.onError?.("User canceled");
        callback.onComplete?.();
        console.log("cancelled");
      }
    } catch (e) {
      callback.onError?.("Not able to signin");
      callback.onComplete?.();
      console.log("error", e);
      console.log(e);
    }
  };

  const loginAsGuest = function (user_id: string, callback: TCallback) {
    let authInfo: TAuthInfo = {
      user_id: user_id,
      name: "Guest User",
      email: "test@test.com",
      profile_image: "",
    };
    saveAuthInfo(authInfo);
    callback.onSuccess?.(authInfo);
    callback.onComplete?.();
  };

  return {
    loading,
    error,
    doAppBoot,
    isNuxShown,
    doMarkNuxShown,
    doCompleteSignIn,
    doSignOut,
    doSignUp,
    navigateNext,
    GoogleSignIn,
    navigateTo,
    FacebookSignIn,
    loginAsGuest,
  };
};
