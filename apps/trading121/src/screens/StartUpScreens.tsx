import React from "react";

import { Avatar } from "react-native-elements";
import { DButton, DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput } from "../components/basic";
import { STYLES } from "../components/styles";
import { TProps } from "./types";
import { Image, Text, View } from "react-native";
import logo from "../../assets/images/icon_white.png";
import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { getRequest } from "../libs/network";
import { processMarketData, processPositionData, processSummaryData } from "../models/processor";
import { deleteData, getData, saveData } from "../libs/stoarge";
import { CACHE_KEY_MARKET, CACHE_KEY_POSITION, CACHE_KEY_SUMMARY, PRO_TRADING_SERVER } from "../appstate/CONST";
import { verifyOrCrash } from "../libs/assert";
import { dlog } from "../libs/dlog";

// Splash screen or boot screen is important for loading the boot data.
// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const SplashScreen = () => {
  const appState = useContext(AppStateContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        // try load from cache.
        let data = await getRequest(`${PRO_TRADING_SERVER}/latest?candle_type=5m`, CACHE_KEY_MARKET, true);
        let data1 = await getRequest(`${PRO_TRADING_SERVER}/summary`, CACHE_KEY_SUMMARY);
        appState.dispatch({ type: "UPDATE_MARKET", payload: processMarketData(data) });
        appState.dispatch({ type: "UPDATE_SUMMARY", payload: processSummaryData(data1) });
        // mark boot complete
        setLoading(false);
        appState.dispatch({ type: "MARK_BOOT_COMPLETE" });
        dlog.d("DONE");
      } catch (e) {
        dlog.d(e);
        setError("Not able to find data");
        dlog.d("ERROR");
        dlog.d(e.stack);
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
  let name = "SignIn";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    async function checkSignIn() {
      let userInfo = await getData("USER_INFO");
      if (userInfo) {
        appState.dispatch({ type: "UPDATE_USER_INFO", payload: userInfo });
        appState.dispatch({ type: "MARK_LOGIN_SUCCESS", payload: null });
      } else {
        dlog.d("No save user info found");
      }
    }
    checkSignIn();
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  function signIn() {
    if (email.trim().length == 0) {
      return;
    }
    let userInfo = { name: "Guest", email: email.toLocaleLowerCase().trim(), user_id: email.toLocaleLowerCase().trim() };
    saveData("USER_INFO", userInfo);
    appState.dispatch({ type: "UPDATE_USER_INFO", payload: userInfo });
    appState.dispatch({ type: "MARK_LOGIN_SUCCESS", payload: null });
  }
  return (
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", paddingHorizontal: 20 }}>
      <Image
        style={{
          width: 80,
          height: 80,
          backgroundColor: "transparent",
          alignSelf: "center",
          marginBottom: 0,
        }}
        source={logo}
      />
      <Text style={{ color: "white", textAlign: "center", fontWeight: "bold", fontSize: 26 }}>Welcome to Trading50!</Text>
      <Text style={{ color: "white", textAlign: "center", marginBottom: 50, marginTop: 10, alignSelf: "center", fontSize: 18, opacity: 0.75 }}>
        We helps you be a better trader.
      </Text>
      <DText secondary dark style={{ fontSize: 15 }}>
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
  let name = "SignUp";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);
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
  let name = "Profile";
  useEffect(() => {
    dlog.d(`Mounted ${name}`);
    return () => {
      dlog.d(`Unmounted ${name}`);
    };
  }, []);

  return (
    <DContainer overrideStyle={{ justifyContent: "center", alignItems: "center" }}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 20,
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Avatar
          rounded
          size="large"
          source={{
            uri:
              "https://media-exp1.licdn.com/dms/image/C4D03AQG7ULIkCmRFTA/profile-displayphoto-shrink_200_200/0/1516571220413?e=1623283200&v=beta&t=zv1tVZEVQ51HgQeIejWGPSqFK5yHw8caNdlMtmXPzJM",
          }}
        />
        <Text style={{ color: "#000000ee", fontSize: 20, marginTop: 20, fontWeight: "bold" }}>{appState.state.userInfo.name}</Text>
        <Text style={{ color: "#000000ee", fontSize: 16, marginTop: 10, fontWeight: "normal" }}>Email - {appState.state.userInfo.email}</Text>
        <Text style={{ color: "#000000ee", fontSize: 16, marginTop: 10, fontWeight: "normal" }}>Id -{appState.state.userInfo.email}</Text>
        <DButton onPress={signOut} secondary>
          Sign out
        </DButton>
      </View>
    </DContainer>
  );
};
