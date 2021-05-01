import React, { useContext } from "react";
import { dlog } from "../libs/dlog";
import { getBool, getData, saveData, setBool } from "../libs/stoarge";
import { CoreStateContext } from "./CoreContext";
import { CompleteSignInScreen } from "./CompleteSignInScreen";
import { SignInScreen } from "../screens/ThemeTest";
import { NuxScreen } from "./NUXScreen";
import * as Facebook from "expo-facebook";
import { TAuthInfo, TCallback, TCoreScreenName, TCoreScreenType, TErrorCallback, TVoidCalBack } from "./core_model";
import * as Google from "expo-google-app-auth";
import { Alert } from "react-native";

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
        console.log(profile_pic);
        let authInfo: TAuthInfo = {
          user_id: data.email || data.id,
          email: data.email || data.id,
          profile_image: "",
          name: data.name,
        };
        console.log(authInfo);
        coreState.dispatch({
          type: "MERGE_STATE",
          payload: {
            authInfo: authInfo,
          },
        });
        Alert.alert("Logged in!", `Hi ${(await response.json()).name}!`);
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
      console.log(process.env.GOOGLE_AUTH_KEY);
      const result = await Google.logInAsync({
        androidClientId: "290736876800-h120tsplv4jdcf2676dogtjd26f2ftgd.apps.googleusercontent.com", //process.env.GOOGLE_AUTH_KEY,
        scopes: ["profile", "email"],
      });

      if (result.type === "success" && result.user.email) {
        // console.log(result);
        let authInfo: TAuthInfo = {
          user_id: result.user.email,
          name: result.user.name || "Unknown Google User",
          email: result.user.email,
          profile_image: result.user.photoUrl,
        };
        coreState.dispatch({
          type: "MERGE_STATE",
          payload: {
            authInfo: authInfo,
          },
        });
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

  return {
    loading,
    error,
    doAppBoot,
    isNuxShown,
    doMarkNuxShown,
    doCompleteSignIn,
    doSignIn,
    doSignOut,
    doSignUp,
    navigateNext,
    GoogleSignIn,
    navigateTo,
    FacebookSignIn,
  };
};
