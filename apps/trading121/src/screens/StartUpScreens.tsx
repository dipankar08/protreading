import React from "react";

import { Avatar } from "react-native-elements";
import { DButton, DCard, DSpace, DText, DContainer, DLayoutCol, DTextInput, DContainerSafe, ScreenHeader, DLayoutRow } from "../components/basic";
import { STYLES } from "../components/styles";
import { TProps } from "./types";
import { Image, Text, View, StyleSheet } from "react-native";
import logo from "../../assets/images/icon_white.png";
import { useContext, useEffect, useState } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { deleteData, getData, saveData } from "../libs/stoarge";
import { dlog } from "../libs/dlog";
import { useNetwork } from "../hooks/useNetwork";

// Profile and Signout logic
export const ProfileScreen = ({ navigation, route }: TProps) => {
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
        <DButton
          onPress={() => {
            navigation.push("TestScreen");
          }}
          secondary
        >
          Test
        </DButton>
      </DLayoutCol>
    </DContainerSafe>
  );
};

// Use this cscreen for testing purpose
import { WebView } from "react-native-webview";
export const TestScreen = () => {
  return (
    <DContainerSafe style={{ flex: 1 }}>
      <DLayoutCol style={{ flex: 1 }}>
        <WebView source={{ uri: "https://uk.tradingview.com/symbols/NSE-TCS/" }} style={{ flex: 1 }} />
      </DLayoutCol>
    </DContainerSafe>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  video: {
    marginTop: 20,
    maxHeight: 200,
    width: 320,
    flex: 1,
  },
});
