import React from "react";

import { Avatar } from "react-native-elements";
import { DButton, DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput } from "../components/basic";
import { STYLES } from "../components/styles";
import { TProps } from "./types";
import { Image } from "react-native";
import logo from "../../assets/images/logo.png";
import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { getRequest } from "../libs/network";
import { processLatestData, processSummaryData } from "../models/processor";
import { deleteData, getData, saveData } from "../libs/stoarge";

// Splash screen or boot screen is important for loading the boot data.
// In this screen we are trying to load data from network or in cache...
export const SplashScreen = () => {
  const appState = useContext(AppStateContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        // try load from cache.
        let data = await getRequest("https://dev.api.grodok.com:5000/latest?candle_type=5m");
        let data1 = await getRequest("https://dev.api.grodok.com:5000/latest");

        appState.dispatch({ type: "UPDATE_MARKET_DATA", payload: processLatestData(data) });
        // try load from cache.

        appState.dispatch({ type: "UPDATE_SUMMARY_DATA", payload: processSummaryData(data1) });
        // mark boot complete
        setLoading(false);
        appState.dispatch({ type: "MARK_BOOT_COMPLETE" });
        console.log("DONE");
      } catch (e) {
        console.log(e);
        setError("Not able to find data");
        console.log("ERROR");
        console.log(e.stack);
        setLoading(false);
      }
    }
    fetchAllData();
  }, []);

  return (
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
      <DText dark>Loading .....</DText>
      {error.length > 0 ? <DText dark>{error}</DText> : <DText>Please wait....</DText>}
    </DContainer>
  );
};

// Sign in Logics
export const SignInScreen = ({ navigation }: TProps) => {
  const [email, setEmail] = useState("");
  const appState = useContext(AppStateContext);

  useEffect(() => {
    async function checkSignIn() {
      if (getData("USER_INFO")) {
        console.log(getData("USER_INFO"));
        appState.dispatch({ type: "MARK_USER_SIGN_IN", payload: getData("USER_INFO") });
      }
    }
    //checkSignIn();
  }, []);

  function signIn() {
    if (email.trim().length == 0) {
      return;
    }
    let userInfo = { name: "Guest", email: email };
    saveData("USER_INFO", userInfo);
    appState.dispatch({ type: "MARK_USER_SIGN_IN", payload: userInfo });
  }
  return (
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", paddingHorizontal: 40 }}>
      <Image
        style={{
          width: 100,
          height: 100,
          backgroundColor: "transparent",
          alignSelf: "center",
          marginBottom: 40,
        }}
        source={logo}
      />
      <DText center primary bold dark>
        Welcome to trading121!
      </DText>
      <DText center secondary dark>
        Enter your email address to sign in.
      </DText>
      <DTextInput placeholder="enter the text" dark onChangeText={setEmail}></DTextInput>
      <DButton dark primary onPress={signIn}>
        Sign In
      </DButton>
    </DContainer>
  );
};

// Sign up logic...
export const SignUpScreen = ({ navigation }: TProps) => {
  return (
    <DContainer>
      <DText>Create a new Account</DText>
      <DButton />
    </DContainer>
  );
};

// Profile and Signout logic
export const ProfileScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  async function signOut() {
    await deleteData("USER_INFO");
    appState.dispatch({ type: "MARK_USER_SIGNED_OUT" });
  }

  return (
    <DContainer overrideStyle={{ justifyContent: "center", alignItems: "center" }}>
      <DCard overrideStyle={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          rounded
          size="large"
          source={{
            uri:
              "https://media-exp1.licdn.com/dms/image/C4D03AQG7ULIkCmRFTA/profile-displayphoto-shrink_200_200/0/1516571220413?e=1623283200&v=beta&t=zv1tVZEVQ51HgQeIejWGPSqFK5yHw8caNdlMtmXPzJM",
          }}
        />
        <DSpace />
        <DText>{appState.state.userInfo.name}</DText>
        <DText>{appState.state.userInfo.email}</DText>
        <DSpace />
        <DSpace />
        <DButton onPress={signOut}>Sign out</DButton>
      </DCard>
    </DContainer>
  );
};
