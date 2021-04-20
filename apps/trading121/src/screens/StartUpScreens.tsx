import React from "react";

import { Avatar } from "react-native-elements";
import { DButton, DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput, DContainerSafe, ScreenHeader, DLayoutRow } from "../components/basic";
import { STYLES } from "../components/styles";
import { TProps } from "./types";
import { Image, Text, View } from "react-native";
import logo from "../../assets/images/icon_white.png";
import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { deleteData, getData, saveData } from "../libs/stoarge";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";

// Splash screen or boot screen is important for loading the boot data.
// In this screen we are trying to import { CACHE_KEY_MARKET } from '../appstate/CONST';
export const SplashScreen = () => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();
  useEffect(() => {
    network.reLoadAllData(() => {
      appState.dispatch({ type: "MARK_BOOT_COMPLETE" });
    });
  }, []);

  return (
    <DContainer style={{ backgroundColor: STYLES.APP_COLOR_PRIMARY, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 }}>
      <DText dark>Loading .....</DText>
      {network.error.length > 0 ? <DText dark>{network.error}</DText> : <DText>Please wait....</DText>}
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
  const network = useNetwork();
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
    <DContainerSafe style={{ padding: 16 }}>
      <DLayoutCol style={{ alignContent: "center" }}>
        <ScreenHeader title="Market Summary" style={{ padding: 16 }}></ScreenHeader>
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
        <Text style={{ fontSize: 20, marginTop: 10, paddingTop: 10, borderTopWidth: 1 }}>Update Data</Text>
        <DButton style={{ marginEnd: 10 }} onPress={network.forceUpdateData}>
          Refresh Data in backend
        </DButton>

        <Text style={{ flex: 1 }}>Hello</Text>
        <DButton onPress={signOut} secondary>
          Sign out
        </DButton>
      </DLayoutCol>
    </DContainerSafe>
  );
};
