import React, { useState, useContext, useEffect } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainer, DText, DTextInput, DButton } from "../components/basic";
import { STYLES } from "../components/styles";
import { dlog } from "../libs/dlog";
import { getData, saveData } from "../libs/stoarge";
import { TProps } from "../screens/types";
import { Image, Text, View, StyleSheet } from "react-native";
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
